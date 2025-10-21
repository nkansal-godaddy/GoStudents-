import { passwordRequirements } from '@/lib/password';

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">Password requirements:</div>
      <div className="space-y-1">
        {passwordRequirements.map((req, index) => {
          const isValid = req.check(password);
          return (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isValid ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {isValid && (
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${isValid ? 'text-green-700' : 'text-gray-600'}`}>
                {req.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
