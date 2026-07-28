import React from "react";
import { twMerge } from "tailwind-merge";

interface PasswordStrengthMeterProps {
  password: string;
  /** Override for screens with a fixed dark background independent of the app's theme toggle */
  className?: string;
}

const PasswordStrengthMeter = ({ password, className }: PasswordStrengthMeterProps) => {
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: 'bg-[var(--color-neutral-200)]' };

    let strength = 0;
    if (pwd.length > 5) strength += 1;
    if (pwd.match(/[a-z]+/)) strength += 1;
    if (pwd.match(/[A-Z]+/)) strength += 1;
    if (pwd.match(/[0-9]+/)) strength += 1;
    if (pwd.match(/[!@#$%^&*(),.?":{}|<>]+/)) strength += 1;

    const strengthMap = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Moderate', color: 'bg-yellow-500' },
      { label: 'Strong', color: 'bg-blue-500' },
      { label: 'Very Strong', color: 'bg-green-500' }
    ];
    return {
      strength: (strength / 5) * 100,
      ...strengthMap[Math.min(strength - 1, 4)]
    };
  };

  const { strength, label, color } = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className={twMerge("mt-2", className)}>
      <div className="w-full bg-[var(--color-neutral-200)] rounded-full h-1.5 mb-1 password-strength-track">
        <div
          className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${strength}%` }}
        ></div>
      </div>
      <p className="text-xs text-[var(--color-neutral-500)] password-strength-label">
        Password strength: <span className="font-medium text-[var(--color-neutral-700)]">{label}</span>
      </p>
    </div>
  );
};

export default React.memo(PasswordStrengthMeter);
