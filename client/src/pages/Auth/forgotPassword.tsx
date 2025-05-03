import { Button } from '@/components/ui/button';
import { forgotPassword } from '@/store/authSlice';
import { AppDispatch } from '@/store/store';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>(); // Type the dispatch function

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email.");
            return;
        }

        try {
            setLoading(true);
            const resultAction = await dispatch(forgotPassword(email));

            // Check if the action was fulfilled
            if (forgotPassword.fulfilled.match(resultAction)) {
                toast.success("Password reset email sent!");
            } else {
                toast.error(resultAction.payload as string);
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                    />
                </div>
                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded-md"
                >
                    {loading ? 'Sending...' : 'Reset Password'}
                </Button>
            </form>
        </div>
    );
}

export default ForgotPassword;
