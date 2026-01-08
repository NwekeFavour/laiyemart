import { Box, Typography, Button, Sheet } from '@mui/joy';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', bgcolor: '#f8fafc', p: 3 
    }}>
      <Sheet sx={{
        textAlign: 'center', p: 5, borderRadius: '32px', maxWidth: 450,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)',
      }}>
        <Box sx={{ 
          display: 'flex', justifyContent: 'center', mb: 3,
          color: '#dc2626', bgcolor: '#fee2e2', width: 80, height: 80,
          borderRadius: '24px', alignItems: 'center', mx: 'auto'
        }}>
          <ShieldAlert size={40} />
        </Box>

        <Typography level="h3" sx={{ fontWeight: 800, mb: 1 }}>
          Access Restricted
        </Typography>
        
        <Typography level="body-md" sx={{ color: 'neutral.500', mb: 4 }}>
          You don't have permission to access the Super Admin dashboard. 
          Please return to your store management area.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button 
            variant="solid" 
            className="bg-slate-900! hover:bg-slate-800!"
            size="lg"
            startDecorator={<Home size={18} />}
            onClick={() => navigate('/dashboard/beta')}
            sx={{ borderRadius: 'xl' }}
          >
            Back to My Store
          </Button>
          
          <Button 
            variant="plain" 
            color="neutral"
            startDecorator={<ArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </Box>
      </Sheet>
    </Box>
  );
};

export default Unauthorized;