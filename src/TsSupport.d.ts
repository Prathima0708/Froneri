//RnUiLib button declaration
declare module 'react-native-ui-lib/src/commons/modifiers';
declare module 'react-native-ui-lib/src/components/button';

// Svg image declaration
declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

// Azure ad auth
declare module 'react-native-app-auth' {
  export function authorize(config: Object): Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpirationDate: string;
  }>;
  export function refresh(
    config: Object,
    tokens: {refreshToken: string},
  ): Promise<{accessToken: string; refreshToken: string}>;
  export function revoke(
    config: Object,
    tokens: {tokenToRevoke: string; includeBasicAuth: boolean},
  ): Promise<void>;
}
