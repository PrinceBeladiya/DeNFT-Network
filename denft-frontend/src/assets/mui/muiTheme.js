import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import theme from './theme';
import overrides from './overrides';

const muiTheme = createMuiTheme(Object.assign(overrides, theme));

export default muiTheme;

