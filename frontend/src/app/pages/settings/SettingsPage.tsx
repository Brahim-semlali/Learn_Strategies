import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const SettingsPage = () => {
  return (
    <div className="min-h-screen page-bg">
      <div className="hero-gradient text-white py-8 mb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-xl">
              <Settings className="w-8 h-8 text-white drop-shadow-sm" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-md">Settings</h1>
              <p className="text-white/90 text-sm mt-1 font-medium">Parameters</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-2">Application</h2>
          <p className="text-sm text-gray-600">
            Configure your preferences here.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
