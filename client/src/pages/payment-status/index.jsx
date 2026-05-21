import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCheckPaymentStatusQuery } from "../../features/payment/paymentApi";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import toast from "react-hot-toast";

const PaymentStatus = () => {
    const { merchantTransactionId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isError } = useCheckPaymentStatusQuery(merchantTransactionId);

    useEffect(() => {
        if (data) {
            if (data.success) {
                toast.success("Payment Successful! You can now download your notes.");
            } else {
                toast.error("Payment Failed. Please try again.");
            }
        }
    }, [data]);

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-32 flex flex-col items-center justify-center px-4 text-center">
                <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-lg">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <h2 className="text-xl font-semibold">Verifying Payment...</h2>
                            <p className="text-muted-foreground text-sm">Please do not refresh or close this page.</p>
                        </div>
                    ) : isError || !data?.success ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                                <Icon name="XCircle" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Payment Failed</h2>
                            <p className="text-muted-foreground">Something went wrong with your transaction. If money was deducted, it will be refunded within 5-7 days.</p>
                            <button 
                                onClick={() => navigate(-1)}
                                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                <Icon name="CheckCircle" size={40} />
                            </div>
                            <h2 className="text-2xl font-bold text-foreground">Payment Successful</h2>
                            <p className="text-muted-foreground">Thank you for your purchase! You can now go back and download your notes.</p>
                            <button 
                                onClick={() => navigate(-1)}
                                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                            >
                                Back to Downloads
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PaymentStatus;
