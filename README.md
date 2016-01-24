# PdC10 : Applications réparties adaptables

Notes : https://titanpad.com/pdc

## Objectif
Monitor : faire des mesures sur des métriques pour récolter des informations

Analyse : détecter les événements importants/anormaux (pannes, attaque, montée en charge), on peut faire des règles d'inférence

Plan : comment réagir face à ces événements ?

Execute : Appliquer le plan sur le système (il faut qu'il y ait des patchs)

## Architecture
instance-monitor : récupère les infos (loadavg) de la machine sur laquelle il se trouve

global-monitor : reçoit les infos des instance-monitor et décide d'il faut ajouter/enlever un serveur ou non

## Installation

npm install dans le dossier global-monitor

npm install dans le dossier instance-monitor
 
## Utilisation
node index.js

Lancer au moins 1 instance-monitor (comment ? TODO)

Lancer le global-monitor (comment ? TODO)

Modifier la charge (comment ? TODO)

## Benchmark
Mettre dans fiboapp une valeur de test (ex : 40) pour voir le temps d'exécution

node fiboapp.js 3000 // Lancer fiboapp sur port d'écoute 3000

node fiboapp.js 3000 node fiboapp.js 3001 node fiboapp.js 3002 sur 3 terminaux différents pour lancer 3 instances