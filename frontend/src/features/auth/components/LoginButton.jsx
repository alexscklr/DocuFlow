import { Button } from '@/shared/components';
import { useAppData } from '@/shared/context/AppDataContextBase';
import userIcon from '@/assets/react.svg';

export const LoginButton = () => {
  const { user } = useAppData();

  if (!user) {
    return (
      <Button
        label="Login"
        slug="/access"
      />
    );
  }

  return (
    <Button
      label={user.email}
      slug="/profile"
      icon={userIcon}
      iconPosition="right"
    />
  );
};
