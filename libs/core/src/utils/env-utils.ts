export const getEnv = ({
    key,
    defaultValue,
  }: {
    key: keyof NodeJS.ProcessEnv;
    defaultValue?: string;
  }): string => {
    return process.env[key] || defaultValue || '';
  };
  