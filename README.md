# PDC10 : Applications réparties adaptables : Load Balancer

Notes : https://titanpad.com/pdc

## Objectif
Monitor : faire des mesures sur des métriques pour récolter des informations
Analyse : détecter les événements importants/anormaux (pannes, attaque, montée en charge), on peut faire des règles d'inférence
Plan : comment réagir face à ces événements ?
Execute : Appliquer le plan sur le système (il faut qu'il y ait des patchs)

## Architecture
instance-monitor : récupère les infos (loadavg) de la machine sur laquelle il se trouve
global-monitor : reçoit les infos des instance-monitor et décide d'il faut ajouter/enlever un serveur ou non

## Utilisation
Lancer au moins 1 instance-monitor (comment ? TODO)
Lancer le global-monitor (comment ? TODO)
Modifier la charge (comment ? TODO)
