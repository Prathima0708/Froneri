import {Typography, Spacings, BorderRadiuses} from 'react-native-ui-lib';
import {Typography as TypographyPresets} from 'src/styles/config/TypographyStyles';
import {Spacings as SpacingsPresets} from 'src/styles/config/SpacingStyles';
import {BorderRadiuses as BorderRadiusesPresets} from 'src/styles/config/BorderRadiusStyles';

//Custom ColourPalette moved into theme provider file..
Typography.loadTypographies({
  ...TypographyPresets,
});

Spacings.loadSpacings({
  ...SpacingsPresets,
});

BorderRadiuses.loadBorders({
  ...BorderRadiusesPresets,
});
