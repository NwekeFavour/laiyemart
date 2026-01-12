import React, { useState } from 'react';
import { Box, Button, Input, Typography, Divider, Card, Tabs, TabList, Tab, TabPanel, Checkbox, IconButton, Alert } from '@mui/joy';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Store, User, Github } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { loginCustomer } from '../../../../services/customerService';
import { getSubdomain } from '../../../../storeResolver';
import { toast } from 'react-toastify';

export default function AuthPage({ isDark }) {
  const [showPassword, setShowPassword] = useState(false);
  const {storeSlug: paramSlug} = useParams();
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  // Slate Theme Colors
  const colors = {
    bg: isDark ? '#020617' : '#f8fafc',
    card: isDark ? '#0f172a' : '#ffffff',
    input: isDark ? '#1e293b' : '#f1f5f9',
    border: isDark ? '#334155' : '#e2e8f0',
    textMuted: isDark ? '#94a3b8' : '#64748b',
    primary: isDark ? '#f8fafc' : '#0f172a', // High contrast slate
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const activeSlug = paramSlug || getSubdomain();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginCustomer({
        email: formData.email,
        password: formData.password,
        // Even though your service doesn't take storeSlug yet, 
        // we'll pass it to be safe for multi-tenant logic
        storeSlug: activeSlug 
      });

      // Redirect to store home on success
      toast.success("Logged In Successfully")
      setTimeout(() => {
        navigate(`/`); 
      }, 4000)
    } catch (err) {
      toast.error(err.message)
      setTimeout(() =>{
        setError(err.message || "Invalid email or password");
      }, 2000)
      setTimeout(() => setError(null), 7000)
    } finally {
      setError("")
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: colors.bg,
      p: 2
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 420, 
        borderRadius: '24px', 
        p: 3, 
        bgcolor: colors.card,
        border: '1px solid',
        borderColor: colors.border,
        boxShadow: isDark ? '0 20px 25px -5px rgba(0,0,0,0.5)' : 'xl'
      }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <div className='flex items-center justify-between  gap-2'>
                <div className="w-8 h-8 rounded-md bg-red-500" />

                <Typography className="text lg:text-[16px]! text-[13px]!" sx={{ fontWeight: 800, fontSize: '22px', color: colors.primary, letterSpacing: '-0.02em' }}>
                    LAYE<span className='text' style={{ color: '#ef4444' }}>MART</span>
                </Typography>
            </div>         
            <Typography sx={{ color: colors.textMuted, fontSize: '14px', mt: 0.5 }}>
                The all-in-one slate marketplace
            </Typography>
        </Box>

        <Tabs defaultValue={0} sx={{ bgcolor: 'transparent' }}>

          {[0].map((value) => (
            <TabPanel key={value} value={value} sx={{ p: 0, mt: 1 }}>
              {error && (
                <Alert color="danger" variant="soft" sx={{ mb: 2, borderRadius: '12px' }}>
                  {error}
                </Alert>
              )}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Typography level="body-sm" sx={{ mb: 0.8, fontWeight: 600, color: colors.textMuted }}>
                    Email
                  </Typography>
                    <div className="relative group">
                        {/* Icon Layer */}
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400 group-focus-within:text-slate-500 transition-colors" />
                        </div>

                        {/* Standard Input */}
                        <input
                        id="email"
                        name='email'
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="
                            w-full block bg-white text-slate-900 text-sm py-3 pl-11 pr-4
                            border border-slate-200 rounded-xl
                            placeholder:text-slate-400
                            transition-all duration-200
                            outline-none
                            /* This is the magic part: Slate focus instead of blue */
                            focus:border-slate-500 
                            focus:ring-4 
                            focus:ring-slate-400/20
                        "
                        />
                    </div>                
                </Box>

                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                        <Typography level="body-sm" sx={{ fontWeight: 600, color: colors.textMuted }}>Password</Typography>
                        <Link sx={{ fontSize: '12px', fontWeight: 600, color: '#ef4444', textDecoration: 'none' }}>Forgot?</Link>
                    </Box>
                    <div className="flex flex-col gap-1.5 w-full">
                    {/* Input Container */}
                        <div className="relative group">
                            {/* Start Icon (Lock) */}
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Lock 
                                size={18} 
                                className="text-slate-400 group-focus-within:text-slate-500 transition-colors" 
                            />
                            </div>

                            {/* Standard Input */}
                            <input
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="
                                w-full block bg-white text-slate-900 text-sm py-3 pl-11 pr-11
                                border border-slate-200 rounded-xl
                                placeholder:text-slate-400
                                transition-all duration-200
                                outline-none
                                focus:border-slate-500 
                                focus:ring-4 
                                focus:ring-slate-400/15
                            "
                            />

                            {/* End Decorator (Eye Toggle) */}
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                            >
                            {showPassword ? (
                                <EyeOff size={18} strokeWidth={2.5} />
                            ) : (
                                <Eye size={18} strokeWidth={2.5} />
                            )}
                            </button>
                        </div>
                    </div>
                </Box>

                <Checkbox 
                  label="Remember this device" 
                  size="sm" 
                  sx={{ color: colors.textMuted, '& .MuiCheckbox-label': { fontWeight: 500 } }} 
                />

                <Button
                  fullWidth
                  size="lg"
                  loading={loading} // 👈 Add loading state
                  onClick={handleLogin} // 👈 Add click handler
                  endDecorator={!loading && <ArrowRight size={18} />}
                  sx={{
                    borderRadius: '12px',
                    mt: 1,
                    py: 1.5,
                    fontWeight: 700,
                    bgcolor: colors.primary,
                    color: isDark ? '#0f172a' : '#ffffff',
                    '&:hover': { bgcolor: isDark ? '#e2e8f0' : '#1e293b' },
                  }}
                >
                  {loading ? 'Authenticating...' : 'Sign In to Shop'}
                </Button>
              </Box>
            </TabPanel>
          ))}
        </Tabs>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '14px', color: colors.textMuted }}>
            Don't have an account?{' '}
            <Link className='text-[#64748b] hover:text-[#0f172a] hover:underline' to={`/register`}>
              Create Account
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}