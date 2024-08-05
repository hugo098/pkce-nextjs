import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';

const Page = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div>Hello world!</div>
      <span>{session?.user?.name}</span>
      <div>Access Token: {session?.accessToken}</div>
      <div>Refresh Token: {session?.refreshToken}</div>
      <div>AT Expires at: {session?.accessTokenExpiresIn}</div>
      <div>
        AT Expires at: {`${new Date(session?.accessTokenExpiresIn! * 1000)}`}
      </div>
    </>
  );
};

export default Page;
