import { useProductStore } from '../store/productStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toast, hideToast } = useProductStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/30 bg-emerald-950/80 text-emerald-100 shadow-emerald-900/20',
    error: 'border-rose-500/30 bg-rose-950/80 text-rose-100 shadow-rose-900/20',
    info: 'border-sky-500/30 bg-sky-950/80 text-sky-100 shadow-sky-900/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl transition-all duration-300 ${
          borders[toast.type]
        }`}
      >
        {icons[toast.type]}
        <p className="text-sm font-medium pr-2 leading-relaxed">{toast.message}</p>
        <button
          onClick={hideToast}
          className="ml-auto text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
