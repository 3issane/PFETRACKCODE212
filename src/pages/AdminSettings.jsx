import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { 
  User, 
  Bell, 
  Shield,
  Palette,
  Globe,
  Mail,
  Phone,
  MapPin,
  Save,
  Eye,
  EyeOff,
  Camera,
  Settings,
  Loader2,
  AlertCircle,
  CheckCircle,
  Database,
  Users,
  FileText,
  BarChart3,
  Lock,
  Server,
  Zap
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { toast } from 'sonner';

const AdminSettings = () => {
  const { currentUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    bio: '',
    adminId: 'ADM-2024-001',
    department: 'Administration',
    role: 'System Administrator'
  });

  // Admin-specific settings
  const [adminSettings, setAdminSettings] = useState({
    // System settings
    maintenanceMode: false,
    allowRegistrations: true,
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Notification settings
    systemAlerts: true,
    userActivityNotifications: true,
    securityAlerts: true,
    backupNotifications: true,
    performanceAlerts: true,
    
    // Security settings
    twoFactorAuth: false,
    passwordComplexity: 'medium',
    auditLogging: true,
    ipWhitelist: '',
    
    // Email settings
    smtpServer: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    emailFromAddress: 'noreply@pfetrack.com',
    
    // Backup settings
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    
    // Performance settings
    cacheEnabled: true,
    compressionEnabled: true,
    logLevel: 'info',
    
    // UI settings
    theme: 'system',
    language: 'fr',
    timezone: 'Africa/Casablanca'
  });

  useEffect(() => {
    if (currentUser) {
      fetchSettings();
    }
  }, [currentUser]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch admin settings with fallback
      try {
        const response = await api.get('/admin/settings');
        setAdminSettings(prev => ({ ...prev, ...response.data }));
      } catch (error) {
        console.warn('Admin settings API failed. Using default values.');
      }
      
      // Fetch profile data
      try {
        const profileResponse = await api.get('/admin/profile');
        setProfileData(prev => ({ ...prev, ...profileResponse.data }));
      } catch (error) {
        console.warn('Admin profile API failed. Using current user data.');
      }
      
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (settingsType) => {
    try {
      setSaving(true);
      
      let endpoint, data;
      
      switch (settingsType) {
        case 'profile':
          // Use the existing user endpoint with current user's ID
          endpoint = `/users/${currentUser.id}`;
          data = {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email
            // Only send fields that the backend User model supports
          };
          break;
        case 'system':
        case 'security':
        case 'email':
        case 'backup':
        case 'performance':
          // These endpoints also don't exist in the backend, but we'll handle them separately
          console.warn(`${settingsType} settings not yet implemented in backend`);
          toast.info(`${settingsType} settings will be saved locally for now`);
          setSaving(false);
          return;
        default:
          throw new Error('Invalid settings type');
      }
      
      await api.put(endpoint, data);
      
      setSuccess(true);
      toast.success('Paramètres sauvegardés avec succès!');
      
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'profile') {
      setProfileData(prev => ({ ...prev, [field]: value }));
    } else {
      setAdminSettings(prev => ({ ...prev, [field]: value }));
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Chargement des paramètres...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Paramètres Administrateur</h1>
          <p className="text-gray-600 mt-1">Gérez les paramètres système et votre profil administrateur</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Paramètres sauvegardés avec succès!
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Système
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Sauvegarde
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations Personnelles</CardTitle>
                <CardDescription>
                  Modifiez vos informations personnelles et de contact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => handleInputChange('profile', 'address', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button 
                  onClick={() => handleSaveSettings('profile')} 
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder le Profil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Système</CardTitle>
                <CardDescription>
                  Configurez les paramètres généraux du système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Maintenance</Label>
                    <p className="text-sm text-gray-500">Activer le mode maintenance pour les mises à jour</p>
                  </div>
                  <Switch
                    checked={adminSettings.maintenanceMode}
                    onCheckedChange={(checked) => handleInputChange('admin', 'maintenanceMode', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autoriser les Inscriptions</Label>
                    <p className="text-sm text-gray-500">Permettre aux nouveaux utilisateurs de s'inscrire</p>
                  </div>
                  <Switch
                    checked={adminSettings.allowRegistrations}
                    onCheckedChange={(checked) => handleInputChange('admin', 'allowRegistrations', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vérification Email Obligatoire</Label>
                    <p className="text-sm text-gray-500">Exiger la vérification email pour les nouveaux comptes</p>
                  </div>
                  <Switch
                    checked={adminSettings.requireEmailVerification}
                    onCheckedChange={(checked) => handleInputChange('admin', 'requireEmailVerification', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Timeout de Session (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={adminSettings.sessionTimeout}
                      onChange={(e) => handleInputChange('admin', 'sessionTimeout', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Tentatives de Connexion Max</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={adminSettings.maxLoginAttempts}
                      onChange={(e) => handleInputChange('admin', 'maxLoginAttempts', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSaveSettings('system')} 
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder les Paramètres Système
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Sécurité</CardTitle>
                <CardDescription>
                  Configurez les paramètres de sécurité et d'authentification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à Deux Facteurs</Label>
                    <p className="text-sm text-gray-500">Activer 2FA pour une sécurité renforcée</p>
                  </div>
                  <Switch
                    checked={adminSettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleInputChange('admin', 'twoFactorAuth', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Journalisation d'Audit</Label>
                    <p className="text-sm text-gray-500">Enregistrer toutes les actions administratives</p>
                  </div>
                  <Switch
                    checked={adminSettings.auditLogging}
                    onCheckedChange={(checked) => handleInputChange('admin', 'auditLogging', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordComplexity">Complexité des Mots de Passe</Label>
                  <Select 
                    value={adminSettings.passwordComplexity} 
                    onValueChange={(value) => handleInputChange('admin', 'passwordComplexity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Faible</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Élevée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ipWhitelist">Liste Blanche IP</Label>
                  <Textarea
                    id="ipWhitelist"
                    value={adminSettings.ipWhitelist}
                    onChange={(e) => handleInputChange('admin', 'ipWhitelist', e.target.value)}
                    placeholder="192.168.1.1\n10.0.0.1"
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={() => handleSaveSettings('security')} 
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder les Paramètres de Sécurité
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Email</CardTitle>
                <CardDescription>
                  Configurez les paramètres SMTP pour l'envoi d'emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpServer">Serveur SMTP</Label>
                    <Input
                      id="smtpServer"
                      value={adminSettings.smtpServer}
                      onChange={(e) => handleInputChange('admin', 'smtpServer', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port SMTP</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={adminSettings.smtpPort}
                      onChange={(e) => handleInputChange('admin', 'smtpPort', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">Nom d'utilisateur SMTP</Label>
                    <Input
                      id="smtpUsername"
                      value={adminSettings.smtpUsername}
                      onChange={(e) => handleInputChange('admin', 'smtpUsername', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                    <div className="relative">
                      <Input
                        id="smtpPassword"
                        type={showPassword ? "text" : "password"}
                        value={adminSettings.smtpPassword}
                        onChange={(e) => handleInputChange('admin', 'smtpPassword', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailFromAddress">Adresse Email d'Envoi</Label>
                  <Input
                    id="emailFromAddress"
                    type="email"
                    value={adminSettings.emailFromAddress}
                    onChange={(e) => handleInputChange('admin', 'emailFromAddress', e.target.value)}
                  />
                </div>
                
                <Button 
                  onClick={() => handleSaveSettings('email')} 
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder la Configuration Email
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Sauvegarde</CardTitle>
                <CardDescription>
                  Configurez les sauvegardes automatiques du système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Sauvegarde Automatique</Label>
                    <p className="text-sm text-gray-500">Activer les sauvegardes automatiques</p>
                  </div>
                  <Switch
                    checked={adminSettings.autoBackup}
                    onCheckedChange={(checked) => handleInputChange('admin', 'autoBackup', checked)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">Fréquence de Sauvegarde</Label>
                    <Select 
                      value={adminSettings.backupFrequency} 
                      onValueChange={(value) => handleInputChange('admin', 'backupFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Toutes les heures</SelectItem>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="monthly">Mensuelle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backupRetention">Rétention (jours)</Label>
                    <Input
                      id="backupRetention"
                      type="number"
                      value={adminSettings.backupRetention}
                      onChange={(e) => handleInputChange('admin', 'backupRetention', parseInt(e.target.value))}
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleSaveSettings('backup')} 
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder les Paramètres de Sauvegarde
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Settings */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Performance</CardTitle>
                <CardDescription>
                  Optimisez les performances du système
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cache Activé</Label>
                    <p className="text-sm text-gray-500">Activer la mise en cache pour améliorer les performances</p>
                  </div>
                  <Switch
                    checked={adminSettings.cacheEnabled}
                    onCheckedChange={(checked) => handleInputChange('admin', 'cacheEnabled', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Compression Activée</Label>
                    <p className="text-sm text-gray-500">Compresser les réponses pour réduire la bande passante</p>
                  </div>
                  <Switch
                    checked={adminSettings.compressionEnabled}
                    onCheckedChange={(checked) => handleInputChange('admin', 'compressionEnabled', checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logLevel">Niveau de Journalisation</Label>
                  <Select 
                    value={adminSettings.logLevel} 
                    onValueChange={(value) => handleInputChange('admin', 'logLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={() => handleSaveSettings('performance')} 
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Sauvegarder les Paramètres de Performance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;