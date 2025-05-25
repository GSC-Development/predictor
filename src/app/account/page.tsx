"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Trophy, 
  TrendingUp, 
  Calendar, 
  Mail, 
  User, 
  LogOut, 
  Shield, 
  Edit3, 
  Key, 
  Trash2,
  Save,
  X
} from 'lucide-react';

export default function AccountPage() {
  const { user, userProfile, loading, logout, changePassword, updateUserProfile, deleteAccount } = useAuth();
  const router = useRouter();
  
  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  
  // Change password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Delete account state
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  
  // Loading states
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeletingAccountLoading, setIsDeletingAccountLoading] = useState(false);
  
  // Success/error messages
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/predictions');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.name || '');
      setEditEmail(userProfile.email || '');
    }
  }, [userProfile]);

  const handleSignOut = async () => {
    try {
      await logout();
      router.push('/predictions');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editEmail.trim()) return;
    
    setIsUpdatingProfile(true);
    setProfileMessage('');
    
    try {
      await updateUserProfile({
        name: editName.trim(),
        email: editEmail.trim()
      });
      setProfileMessage('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      setProfileMessage(`Error: ${error instanceof Error ? error.message : 'Failed to update profile'}`);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || newPassword !== confirmPassword) return;
    
    setIsUpdatingPassword(true);
    setPasswordMessage('');
    
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage('Password changed successfully!');
      setIsChangingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage(`Error: ${error instanceof Error ? error.message : 'Failed to change password'}`);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) return;
    
    setIsDeletingAccountLoading(true);
    setDeleteMessage('');
    
    try {
      await deleteAccount(deletePassword);
      router.push('/predictions');
    } catch (error) {
      setDeleteMessage(`Error: ${error instanceof Error ? error.message : 'Failed to delete account'}`);
    } finally {
      setIsDeletingAccountLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading account...</span>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Account Required</h1>
            <p className="text-lg text-muted-foreground mb-8">
              You need to sign in to view your account page.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-primary/20">
              <p className="text-muted-foreground mb-4">
                Redirecting to sign in page...
              </p>
              <Button 
                onClick={() => router.push('/predictions')}
                size="lg"
                className="w-full sm:w-auto"
              >
                Go to Sign In Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const joinedDate = userProfile.joinedAt?.toDate?.()?.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) || 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Account Management</h1>
          <p className="text-muted-foreground text-lg">
            Manage your predictor account and view your stats
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Overview */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between text-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  Profile Overview
                </div>
                {!isEditingProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {profileMessage && (
                <div className={`p-4 rounded-lg border ${
                  profileMessage.startsWith('Error') 
                    ? 'bg-destructive/10 border-destructive/20 text-destructive' 
                    : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                  <p className="text-sm text-center font-medium">{profileMessage}</p>
                </div>
              )}

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="editName">Name</Label>
                      <Input
                        id="editName"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="editEmail">Email</Label>
                      <Input
                        id="editEmail"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={isUpdatingProfile || !editName.trim() || !editEmail.trim()}
                      className="flex items-center gap-2"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditName(userProfile.name || '');
                        setEditEmail(userProfile.email || '');
                        setProfileMessage('');
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Personal Info */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <User className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{userProfile.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{userProfile.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Member Since</p>
                          <p className="font-medium">{joinedDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      Your Statistics
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <Trophy className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Total Points</p>
                          <p className="font-bold text-2xl text-primary">{userProfile.totalPoints}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Current Week Points</p>
                          <p className="font-bold text-xl text-secondary">{userProfile.currentWeekPoints}</p>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Status</p>
                        <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-semibold">
                          <Shield className="w-3 h-3" />
                          Active Member
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Management */}
          <Card className="border-2 border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Key className="w-5 h-5 text-secondary" />
                  </div>
                  Password & Security
                </div>
                {!isChangingPassword && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsChangingPassword(true)}
                    className="flex items-center gap-2"
                  >
                    <Key className="w-4 h-4" />
                    Change Password
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {passwordMessage && (
                <div className={`p-4 rounded-lg border ${
                  passwordMessage.startsWith('Error') 
                    ? 'bg-destructive/10 border-destructive/20 text-destructive' 
                    : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                  <p className="text-sm text-center font-medium">{passwordMessage}</p>
                </div>
              )}

              {isChangingPassword ? (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min 6 characters)"
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                    />
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-destructive">Passwords do not match</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={isUpdatingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                      className="flex items-center gap-2"
                    >
                      {isUpdatingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                          Changing...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Change Password
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setPasswordMessage('');
                      }}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Your password is encrypted and secure
                  </p>
                  <p className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    Use a strong, unique password for your account
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="border-2 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/predictions')}
                  className="h-12 text-left justify-start"
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  View Predictions
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/leaderboard')}
                  className="h-12 text-left justify-start"
                >
                  <Trophy className="w-5 h-5 mr-3" />
                  View Leaderboard
                </Button>
              </div>

              <div className="pt-4 border-t space-y-4">
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleSignOut}
                  className="w-full sm:w-auto h-12"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Sign Out
                </Button>

                {/* Delete Account Section */}
                <div className="pt-4 border-t border-destructive/20">
                  <h4 className="font-semibold text-destructive mb-2 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Danger Zone
                  </h4>
                  
                  {deleteMessage && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm text-center font-medium">{deleteMessage}</p>
                    </div>
                  )}

                  {!isDeletingAccount ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setIsDeletingAccount(true)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleDeleteAccount} className="space-y-4">
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-destructive text-sm font-medium mb-2">
                          ⚠️ This will permanently delete your account
                        </p>
                        <p className="text-destructive text-sm">
                          All your predictions, points, and account data will be lost forever.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="deletePassword" className="text-destructive">
                          Enter your password to confirm deletion
                        </Label>
                        <Input
                          id="deletePassword"
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="submit"
                          variant="destructive"
                          disabled={isDeletingAccountLoading || !deletePassword}
                          className="flex items-center gap-2"
                        >
                          {isDeletingAccountLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin"></div>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete Account Forever
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsDeletingAccount(false);
                            setDeletePassword('');
                            setDeleteMessage('');
                          }}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Shield className="w-6 h-6 text-green-600" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Your account is secured with Firebase Authentication
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  We only store necessary data for the prediction game
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  Your email is used only for authentication
                </p>
                <p className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  All data is encrypted and stored securely
                </p>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
} 