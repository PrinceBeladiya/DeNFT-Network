import { ToastContainer } from 'react-toastify';
import Routes from './Routes';
import './assets/styles/app.scss';

function App() {
  return (
    // <MuiThemeProvider theme={MUITheme}>
    <div className="App">
      <ToastContainer id="forToast" />
      <Routes />
    </div>
    // </MuiThemeProvider>
  );
}

export default App;
