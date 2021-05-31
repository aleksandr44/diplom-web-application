import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Alert from '@material-ui/lab/Alert';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import Login from './login'


class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      login: sessionStorage.getItem('login') == 'true',
      user_id: sessionStorage.getItem('user_id'),
      is_student: false,
      is_teacher: false,
      error: false,
    };
  }

  setLogin = (val) => {
    this.setState({login: val})
    sessionStorage.setItem('login', val)
    sessionStorage.setItem('user_id', val)
  }

  inputError = (val) => {
    this.setState({error: val})
  }

  update = () => this.forceUpdate()


  render () {
  return (
    <div>
      <Login ref='child' login={this.state} isLogged={this.setLogin} update={this.update} inputError={this.inputError}/>
      
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Docx detector
          </Typography>
          <Button color="inherit" style={{marginLeft: '5%'}} href="http://localhost:3000/loader">Загрузить работу</Button>

          {(this.state.is_teacher || sessionStorage.is_teacher == 'true') && <Button color="inherit" style={{marginLeft: '2%'}} href="http://localhost:3000/create_style">Задать стили</Button>}
          {(this.state.is_teacher || sessionStorage.is_teacher == 'true') && <Button color="inherit" style={{marginLeft: '2%'}} href="http://localhost:3000/create_task">Создать задание</Button>}
          <Button color="inherit" style={{marginLeft: '2%'}} href="http://localhost:3000/examples">Посмотреть образцы</Button>

          {!this.state.login ?
          <Button style={{marginLeft: '85%', position: 'fixed'}} color="inherit" onClick={(e) => this.refs.child.handleClickOpen(e)}>Вход</Button> :
          <Button style={{marginLeft: '85%', position: 'fixed'}} color="inherit" onClick={(e) => this.refs.child.logout()}>Выход</Button>
      }
          {this.state.login && <IconButton
                aria-label="account of current user"s
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
              >
              </IconButton>}
        </Toolbar>
      </AppBar>
      {this.state.error && <Alert severity="error">Неправивильный логин или пароль! Попробуйте снова.</Alert>}

    </div>
  );
}
}

export default Menu