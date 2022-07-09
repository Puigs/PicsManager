# PictsManager

![Logo](https://cdn.discordapp.com/attachments/959024336075898903/992883530013102181/telechargement.png)

## Qu'est-ce que le PictsManager ?

<p>
Le PictsManager est une application mobile de partage d'images compressées.

L'utilisateur se connecte, depuis l'appli' mobile.
Une fois connecté, il peut prendre avec la caméra de son téléphone une photo, qu'il va ensuite comprésser à sa guise avant de l'uploader.
Cette dite photo peut ensuite être visionnée, placée dans un album ou même partagée à un autre utilisateur de l'application.
</p>

## Lancer le projet

<p>
Pour lancer le projet il vous utiliser la commande suivante :

```
docker-compose up --build
```

Pour télécharger docker et docker-compose vous pouvez utiliser le lien suivant:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04-fr
</p>

## L'Apk

<p>
Vous pouvez retrouver l'APK de l'application dans le dossier public une fois la commande précédente faite.
Sinon, vous pouvez exécuter cette commande pour le générer localement:

```
cd mobile && npm run build:android
```

L'APK généré se retrouvera au path suivant :

```
mobile/android/app/build/outputs/apk/release/app-release.apk
```

</p>

## Technologies utilisées

Back: ExpressJS

Mobile: React Native

La maquette Figma du projet est disponible à [ce lien](https://www.figma.com/file/ZDPlISu98vP9mffcNX090x/PictsManager-App?node-id=224%3A1872).