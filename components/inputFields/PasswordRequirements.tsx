"use client";

import { motion, AnimatePresence } from "framer-motion";
import React from "react";

type PasswordRequirementsProps = {
  password: string;
};

const rules = [
  { label: "At least 6 characters", test: /.{6,}/ },
  { label: "At least one uppercase letter", test: /[A-Z]/ },
  { label: "At least one lowercase letter", test: /[a-z]/ },
  { label: "At least one number", test: /\d/ },
  { label: "At least one special character", test: /[^\w\s]/ },
];

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => {
  return (
    <div className="text-xs mt-2 space-y-1">
      {rules.map((rule, idx) => {
        const passed = rule.test.test(password || "");
        return (
          <motion.div
            key={idx}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={passed ? "passed" : "failed"}
                className="w-2 h-2 rounded-full inline-block"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  backgroundColor: passed ? "#02198b" : "#ccc",
                }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>
            <span className={passed ? "text-paragrah text-sm font-medium" : "text-gray-500"}>
              {rule.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};
