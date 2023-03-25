# ForIA
Forum about IA.

# Changes
AuthService:
    -Login,checkLogin(new),logout,autoAuthUser
    +Canvis a variables, afegit getter pr user{userData,userPrefrences} per observable.

LoginComponent:
    -Es subscriu al authService.Login, encara que el authService.Login "intercepta" la resposta per cridar l'altre petició i guardar l'usuari.
    -Comprova si l'usuari está logejat i el redirigeix a Home.

RegisterComponent:
    -Comprova si l'usuari está logejat i el redirigeix a Home.

App.component:
    -Fa l'autologin.
    -Mosta l'usuari al camp "profile".

Guard:
    -Actualizat el funcionament.

# Remeber
config>cors>allow-credentials = false;
