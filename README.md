# Workana Hiring challenge

## Challenge de Workana basado en el juego de Planning Poker

El challenge da la posibilidad de trabajar en el back o en el front usando Vue para el front y PHP, Nodejs o Mocked Service para el back. En este caso se decidio trabajar tanto en el frontend como en el backend, utilizando Vue 2 para el front y Nodejs para el back.


## Como Jugar

La primera vista que tendremos es la que se puede apreciar en la imagen. En esta parte tendremos que poner nuestro nombre, seleccionar un rol (scrum Master o Votante) y poner el numero de la sala a la que queremos unirnos.



![image text](https://github.com/Tabitoo/Workana-Challenge/blob/main/images/inicio.png)

En caso de que seamos votantes, podremos ver una lista de numeros para votar y otra lista con los jugadores conectados. No podremos votar hasta que el estatus de sala cambie a "voting".

![image text](https://github.com/Tabitoo/Workana-Challenge/blob/main/images/lobby.png)

En caso de que seamos el Scrum Master, veremos una lista con todos los jugadores conectados junto con tres botones, el primero "Cerrar sala e iniciar votos" sirve para cambiar el estatus de la sala, una vez que el estatus pase a "voting", otros usuarios no podrán conectarse, para eso es necesario abrir la sala. El segundo boton elimina la sala, llevando a la pagina principal a todos los participantes. Y por último el tercer voton reinicia los votos de los demas jugadores.

![image text](https://github.com/Tabitoo/Workana-Challenge/blob/main/images/admin.png)

Si un solo jugador vota, el voto solo puede verlo el jugador y no los demas jugadores.

![image text](https://github.com/Tabitoo/Workana-Challenge/blob/main/images/votePlayer.png)

Los votos son revelados una vez que todos los votantes hayan votado

![image text](https://github.com/Tabitoo/Workana-Challenge/blob/main/images/votePlayer2.png)


## Endpoints 

### Join Issue

Method: POST

```

http://localhost:8082/issue/numberIssue/join

```

### Body 

```
{
   rol : value -> string,
   name: value -> string,
   sala: value -> int
}

```

El parametro rol solo puede ser "scrumMaster" o "votante"

### response

```
{
    "status": 200,
    "msg": "OK",
    "data": {
        "name": "Admin",
        "rol": "scrumMaster",
        "status": "joined",
        "id": 1,
        "vote": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjMzNDU4MDYxLCJleHAiOjE2MzM1NDQ0NjF9.HKyCO5g0uEzgDQDOQwzi6PcoF96pfKUsZSbg63GIHjQ"
}

```

### Headers
Para los endopoints siguientes es necesario de un token en el Header, de lo contrario no podrá realizar las peticiones

### Get Issue
Method : GET

```

http://localhost:8082/issue/numberIssue

```

### Response 
```
{
    "status": 200,
    "msg": "OK",
    "data": {
        "id": "3",
        "status": "joining",
        "members": [
            {
                "name": "Admin",
                "rol": "scrumMaster",
                "status": "joined",
                "id": 1,
                "vote": false
            }
        ]
    }
}

```

### Vote Issue 

Method : Post

```
http://localhost:8082/issue/numberIssue/vote

```
### Body

Body para el "scrumMaster"
```
{
  status : value -> string
  idUser : value -> int
}

```

El parametro status solo puede ser "voting" o "joining"

Body para el "votante" 

```
{
  idUser: value -> int
  vote : value -> int or string  
}

```
 El parametro vote solo puede recibir uno de los siguiente valores: 1,2,3,5,8,13,20,40,'?'

### Response

Response para el scrumMaster 

```

{
    "status": 200,
    "msg": "OK",
    "data": {
        "id": "3",
        "status": "voting",
        "members": [
            {
                "name": "Admin",
                "rol": "scrumMaster",
                "status": "joined",
                "id": 1,
                "vote": false
            },
            {
                "name": "A",
                "rol": "votante",
                "status": "joined",
                "id": 2,
                "vote": false
            }
        ]
    }
}

```

Response para el votante

```

{
    "status": 200,
    "msg": "OK",
    "data": {
        "id": "3",
        "status": "voting",
        "members": [
            {
                "name": "Admin",
                "rol": "scrumMaster",
                "status": "joined",
                "id": 1,
                "vote": false
            },
            {
                "name": "A",
                "rol": "votante",
                "status": "voted",
                "id": 2,
                "vote": "13"
            }
        ]
    }
}


```


### Restart Votes

Method : PUT


```
http://localhost:8082/issue/numberIssue/restart

```

### Body

```

{
  idUser : value -> int
}


```

### Response 

```

{
    "status": 200,
    "msg": "OK",
    "data": {
        "id": "3",
        "status": "joining",
        "members": [
            {
                "name": "Admin",
                "rol": "scrumMaster",
                "status": "joined",
                "id": 1,
                "vote": false
            },
            {
                "name": "A",
                "rol": "votante",
                "status": "joined",
                "id": 2,
                "vote": false
            }
        ]
    }
}


```

### Eliminate Issue

Method : DELETE


```
http://localhost:8082/issue/numberIssue/delete

```

### Body

```

{
  idUser : value -> int
}

```
### Response 

```

{
    "status": 200,
    "data": "ok"
}


```




