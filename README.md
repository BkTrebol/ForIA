# ForIA
Forum about IA.

# Structure

## Angular
Define variable type
Constructor
ngOnInit
allOtherMethods
ngOnDestroy

# Tests

## Angular
TOTAL: 57 SUCCESS

## Laravel
2

# Structure

## Angular
Define variable type
Constructor
ngOnInit
allOtherMethods
ngOnDestroy

# Tests

## Angular
TOTAL: 57 SUCCESS

## Laravel
2
# Changes
Components reorganitzats a modules.
Tots els moduls(nostres) s'han d'importar app.module.
Els moduls espeficis(formModule, etc...) s'han d'importar al modul que el necesiti(Ex:LoginModule) o, al share.module de la carpeta modules(importar i exportar) si el faran servir la majoria de moduls. Els altres moduls(except el app.module) importar'an share.module.
NOTA: Evitar que un modul importi un modul innecesari, potser cal reorganitzar-los.

Rutes: app-routing modules fa routing propi, o per prefixes cap als fills, els fills fan les seves rutes(inclouen el prefixe del app-routing)

MES: Els servei s'haurien d'afegir al seu modul/service, queda millor organizat. (Excepte el servici auth, crec que ha d'estar al app.module)
Els guards/interceptors els posaria en una carpeta "helpers"(Tambe aixi ho he vist a vuexy)

Suggeriment:
Separaria el header i footer als seus components, i tractaria de ser lo de tindre varis temes.

OLD-Login:
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
