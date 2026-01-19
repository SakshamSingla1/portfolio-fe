export const PasswordStrengthMeter = ({ password }: { password: string }) => {
    const getPasswordStrength = (pwd: string) => {
      if (!pwd) return { strength: 0, label: '', color: 'bg-gray-200' };
  
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
      <div className="mt-2">
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
          <div
            className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
            style={{ width: `${strength}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500">
          Password strength: <span className="font-medium text-gray-700">{label}</span>
        </p>
      </div>
    );
  };
  