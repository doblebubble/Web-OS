/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef, createContext, useContext } from 'react';
import { GoogleGenAI } from "@google/genai";
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { BIOS_OPTIONS } from './constants/biosOptions';

const OSContext = createContext<any>(null);

const translations: Record<string, Record<string, string>> = {
  'English': {
    'win9': 'Windows 9',
    'vmware': 'VMware Workstation',
    'userName': 'User Name',
    'profilePic': 'Profile Picture URL',
    'darkMode': 'Dark Mode',
    'retroMode': 'Retro Mode',
    'language': 'Language',
    'pcMode': 'PC Mode',
    'taskbarPosition': 'Taskbar Position',
    'taskbarColor': 'Taskbar Color',
    'startButton': 'Taskbar Start Button',
    'mouseCursor': 'Mouse Cursor',
    'wallpaper': 'Desktop Wallpaper',
    'enabled': 'Enabled',
    'disabled': 'Disabled',
    'visible': 'Visible',
    'hidden': 'Hidden',
    'search': 'Search...',
    'launchpad': 'Launchpad',
    'settings': 'Settings',
    'about_os': 'About Web AICESOS',
    'os_name': 'Web AICESOS',
    'os_full_name': 'Awesome Incredible Cool Epic Super Operating System',
    'aboutme': 'About Me',
    'terminal': 'Terminal',
    'paint': 'Paint',
    'calculator': 'Calculator',
    'browser': 'Browser',
    'appmaker': 'App Maker',
    'stonemeni': 'Stonemeni AI',
    'sysmon': 'System Monitor',
    'recyclebin': 'Recycle Bin',
    'taskmanager': 'Task Manager',
    'windowTransparency': 'Window Transparency',
    'animationSpeed': 'Animation Speed',
    'systemSound': 'System Sound',
    'chrome': 'Chrome Store',
    'claude': 'Claude',
    'cydia': 'Cydia',
    'youtube': 'YouTube',
    'roblox': 'Roblox',
    'cookiesoap': 'Cookie Soap',
    'dolphin': 'Dolphin',
    'videoplayer': 'Video Player',
    'error_remix': 'Error Remix',
    'boxbuddy': 'APK Box Buddy',
    'nesplayer': 'NES Player',
    'winxphorror': 'Windows XP Horror Edition',
    'wine': 'Wine',
    'utorrent': 'uTorrent',
    '000': '000.exe',
    'steam': 'Steam',
    'outlook': 'Outlook 2010',
    'eve': 'Eve Online',
    'photoshop': 'Photoshop CC 2015',
    'fallout': 'Fallout NV',
    'reason': 'Reason',
    'skyrim': 'Skyrim Special Ed',
    'gog': 'GOG Galaxy',
    'wizard101': 'Wizard101',
    'matlab': 'Matlab',
    'sims3': 'Sims 3',
    'metatrader': 'MetaTrader 5',
    'pc': 'PC',
    'calendar': 'Calendar',
    'weather': 'Weather',
    'stickynotes': 'Sticky Notes',
    'musicplayer': 'Music Player',
    'gchat': 'Google Chat',
    'imageviewer': 'Image Viewer',
    'bowser': 'Bowser',
    'mspomp': 'Ms. Pomp',
    'w3shit': 'w3SHIT',
    'word': 'Word',
    'excel': 'Excel',
    'powerpoint': 'PowerPoint',
    'docs': 'Docs',
    'slides': 'Slides',
    'cydia_fake': 'Free Cydia',
    'hydra': 'hydra.exe',
    'doge_unlocked': 'DOGE UNLOCKED',
    'talking_horror': 'My Talking Horror',
    'bouncyball': 'Bouncy Ball',
    'balloon': 'Protect Balloon',
    'flappy': 'Flappy Bird',
    'angrybirds': 'Angry Birds',
    'flashplayer': 'Flash Player',
    'doge': 'VERY SECRET APP',
    'omg': 'omg.exe',
    'chilled_windows': 'CHILLED windows',
    'textdocs': 'Text docs'
  },
  "Piraty lan'gage M' Cap'an": {
    'userName': "Pirate's Name",
    'profilePic': 'Flag Image URL',
    'darkMode': 'Night Sail',
    'retroMode': 'Old Map Mode',
    'language': 'Tongue',
    'pcMode': 'Ship Type',
    'taskbarPosition': 'Deck Position',
    'taskbarColor': 'Hull Color',
    'startButton': 'Captain\'s Button',
    'mouseCursor': 'Hook Style',
    'wallpaper': 'Sea View',
    'enabled': 'Aye!',
    'disabled': 'Nay!',
    'visible': 'Spotted!',
    'hidden': 'Buried!',
    'search': 'Seek Treasure...',
    'launchpad': 'The Plank',
    'settings': 'Ship Rules',
    'about_os': 'About This Vessel',
    'aboutme': 'The Captain',
    'terminal': 'Logbook',
    'paint': 'Graffiti',
    'calculator': 'Loot Counter',
    'browser': 'Spyglass',
    'appmaker': 'Ship Builder',
    'stonemeni': 'Rock Parrot AI',
    'sysmon': 'Wind Gauge',
    'recyclebin': 'Locker',
    'taskmanager': 'Crew Manager',
    'windowTransparency': 'Ghost Ship Mode',
    'animationSpeed': 'Wind Speed',
    'systemSound': 'Sea Shanty Volume',
    'chrome': 'Black Market',
    'claude': 'First Mate Claude',
    'youtube': 'Sea Stories',
    'roblox': 'Pirate Games',
    'cookiesoap': 'Scurvy Soap',
    'dolphin': 'Sea Physics',
    'videoplayer': 'Map Projector'
  },
  'Girly': {
    'win9': '✨ Windows 9 ✨',
    'vmware': '🎀 VMware 🎀',
    'userName': 'Princess Name 👑',
    'profilePic': 'Selfie URL 🤳',
    'darkMode': 'Nightie Mode 🌙',
    'retroMode': 'Vintage Vibes 📻',
    'language': 'Girl Talk 💅',
    'pcMode': 'Aesthetic Mode ✨',
    'taskbarPosition': 'Barbie Bar Position',
    'taskbarColor': 'Barbie Bar Color',
    'startButton': 'Magic Button ✨',
    'mouseCursor': 'Sparkly Cursor ✨',
    'wallpaper': 'Cute Wallpaper 🐾',
    'enabled': 'Yasss! ✅',
    'disabled': 'Nope! ❌',
    'visible': 'Slay! ✨',
    'hidden': 'Ghosted! 👻',
    'search': 'Looking for tea... ☕',
    'launchpad': 'Closet 👗',
    'settings': 'Makeover 💄',
    'about_os': 'Gossip 🗣️',
    'aboutme': 'My Bio 💖',
    'terminal': 'Secret Diary 📓',
    'paint': 'Art Class 🎨',
    'calculator': 'Shopping Math 🛍️',
    'browser': 'Shopping Window 🛒',
    'appmaker': 'Boutique 👗',
    'stonemeni': 'Bestie AI 👯‍♀️',
    'sysmon': 'Vibe Check 📈',
    'recyclebin': 'Trash Can 🗑️',
    'taskmanager': 'Drama Manager 🎭',
    'windowTransparency': 'Glassy Vibes ✨',
    'animationSpeed': 'Slay Speed ⚡',
    'systemSound': 'Music Volume 🎵',
    'chrome': 'Pink Store 🛍️',
    'claude': 'Smart Bestie 🧠',
    'cydia': 'Jailbreak 🔓',
    'youtube': 'Vlog Tube 📹',
    'roblox': 'Roblox 🎮',
    'cookiesoap': 'Sweet Filter 🧼',
    'dolphin': 'Gravity Splash 🐬',
    'videoplayer': 'Movie Night 🍿',
    'error_remix': 'Oopsie Remix 🎶',
    'boxbuddy': 'Buddy 📦',
    'nesplayer': 'Retro Games 🎮',
    'winxphorror': 'Spooky XP 👻',
    'wine': 'Drinkies 🍷',
    'utorrent': 'Torrents 📥',
    '000': '000.exe ⚠️',
    'steam': 'Game Club 🎮',
    'outlook': 'Mail 📧',
    'eve': 'Space Drama 🚀',
    'photoshop': 'Filter Shop 📸',
    'fallout': 'Wasteland ☢️',
    'reason': 'Music Maker 🎹',
    'skyrim': 'Dragon Quest 🐉',
    'gog': 'Games 🎮',
    'wizard101': 'Magic School 🪄',
    'matlab': 'Math 🔢',
    'sims3': 'Sims 3 🏠',
    'metatrader': 'Money 💰',
    'pc': 'My PC 💻',
    'calendar': 'Dates 📅',
    'weather': 'Sun & Rain ☀️',
    'stickynotes': 'Pink Notes 📝',
    'musicplayer': 'Playlist 🎵',
    'gchat': 'Bestie Chat 💬',
    'imageviewer': 'Gallery 🖼️',
    'bowser': 'Bowser 🦖',
    'mspomp': 'Teacher 👩‍🏫',
    'w3shit': 'w3SHIT 💩',
    'word': 'Diary 📖',
    'excel': 'Budget 📊',
    'powerpoint': 'Slideshow 📽️',
    'docs': 'Notes 📝',
    'slides': 'Presentation 📽️',
    'cydia_fake': 'Fake Cydia 🤡',
    'hydra': 'hydra.exe 🐍',
    'doge_unlocked': 'DOGE 🐕',
    'talking_horror': 'Horror 👻',
    'bouncyball': 'Ball ⚽',
    'balloon': 'Balloon 🎈',
    'flappy': 'Bird 🐦',
    'angrybirds': 'Birds 🐦',
    'flashplayer': 'Flash ⚡',
    'doge': 'SECRET 🤫',
  },
  "Bri'ish": {
    'userName': 'Proper Name',
    'profilePic': 'Portrait URL',
    'darkMode': 'Evening Mode',
    'retroMode': 'Victorian Mode',
    'language': 'Dialect',
    'pcMode': 'Estate Type',
    'taskbarPosition': 'Shelf Position',
    'taskbarColor': 'Tea Color',
    'startButton': 'Royal Button',
    'mouseCursor': 'Cane Style',
    'wallpaper': 'Garden View',
    'enabled': 'Splendid',
    'disabled': 'Rubbish',
    'visible': 'Present',
    'hidden': 'Absent',
    'search': 'Enquire...',
    'launchpad': 'The Lift',
    'settings': 'Etiquette',
    'about_os': 'About the Crown',
    'aboutme': 'The Gentleman',
    'terminal': 'Typewriter',
    'paint': 'Canvas',
    'calculator': 'Pound Counter',
    'browser': 'Spectacles',
    'appmaker': 'Factory',
    'stonemeni': 'Stone Butler AI',
    'sysmon': 'Tea Gauge',
    'recyclebin': 'Dustbin',
    'taskmanager': 'Butler Manager',
    'windowTransparency': 'Foggy Windows',
    'animationSpeed': 'Queue Speed',
    'systemSound': 'Gramophone Volume',
    'chrome': 'The High Street',
    'claude': 'Sir Claude',
    'youtube': 'The Telly',
    'roblox': 'Cricket Games',
    'cookiesoap': 'Fancy Soap',
    'dolphin': 'Royal Physics',
    'videoplayer': 'Cinema'
  },
  "Wee Wee France": {
    'userName': 'Nom d\'Utilisateur',
    'profilePic': 'URL de Portrait',
    'darkMode': 'Mode Nuit',
    'retroMode': 'Mode Ancien',
    'language': 'Langue',
    'pcMode': 'Mode PC',
    'taskbarPosition': 'Position de la Barre',
    'taskbarColor': 'Couleur de la Barre',
    'startButton': 'Bouton de Départ',
    'mouseCursor': 'Style de Souris',
    'wallpaper': 'Fond d\'Écran',
    'enabled': 'Activé',
    'disabled': 'Désactivé',
    'visible': 'Visible',
    'hidden': 'Caché',
    'search': 'Chercher...',
    'launchpad': 'Le Plateau',
    'settings': 'Réglages',
    'about_os': 'À Propos de Web AICESOS',
    'aboutme': 'À Propos de Moi',
    'terminal': 'Terminal',
    'paint': 'Peinture',
    'calculator': 'Calculatrice',
    'browser': 'Navigateur',
    'appmaker': 'Créateur d\'App',
    'stonemeni': 'IA Pierre',
    'sysmon': 'Moniteur Système',
    'recyclebin': 'Corbeille',
    'taskmanager': 'Gestionnaire de Tâches',
    'windowTransparency': 'Transparence',
    'animationSpeed': 'Vitesse d\'Animation',
    'systemSound': 'Volume du Système',
    'chrome': 'Boutique Chrome',
    'claude': 'Claude l\'IA',
    'youtube': 'Vidéos',
    'roblox': 'Jeux',
    'cookiesoap': 'Savon Cookie',
    'dolphin': 'Physique Dauphin',
    'videoplayer': 'Lecteur Vidéo'
  },
  "EatALee": {
    'userName': 'Nome Utente',
    'profilePic': 'URL Immagine',
    'darkMode': 'Modalità Notte',
    'retroMode': 'Modalità Retro',
    'language': 'Lingua',
    'pcMode': 'Modalità PC',
    'taskbarPosition': 'Posizione Barra',
    'taskbarColor': 'Colore Barra',
    'startButton': 'Pulsante Inizio',
    'mouseCursor': 'Stile Mouse',
    'wallpaper': 'Sfondo',
    'enabled': 'Attivato',
    'disabled': 'Disattivato',
    'visible': 'Visibile',
    'hidden': 'Nascosto',
    'search': 'Cerca...',
    'launchpad': 'Piattaforma',
    'settings': 'Impostazioni',
    'about_os': 'Informazioni Web AICESOS',
    'aboutme': 'Informazioni su di Me',
    'terminal': 'Terminale',
    'paint': 'Pittura',
    'calculator': 'Calcolatrice',
    'browser': 'Browser',
    'appmaker': 'Creatore App',
    'stonemeni': 'IA Pietra',
    'sysmon': 'Monitor Sistema',
    'recyclebin': 'Cestino',
    'taskmanager': 'Gestione Attività',
    'windowTransparency': 'Trasparenza',
    'animationSpeed': 'Velocità Animazione',
    'systemSound': 'Volume Sistema',
    'chrome': 'Negozio Chrome',
    'claude': 'Claudio IA',
    'youtube': 'Video',
    'roblox': 'Giochi',
    'cookiesoap': 'Sapone Biscotto',
    'dolphin': 'Fisica Delfino',
    'videoplayer': 'Lettore Video'
  },
  "Portugal": {
    'userName': 'Nome de Utilizador',
    'profilePic': 'URL da Imagem',
    'darkMode': 'Modo Escuro',
    'retroMode': 'Modo Retro',
    'language': 'Idioma',
    'pcMode': 'Modo PC',
    'taskbarPosition': 'Posição da Barre',
    'taskbarColor': 'Cor da Barra',
    'startButton': 'Botão Iniciar',
    'mouseCursor': 'Estilo do Rato',
    'wallpaper': 'Papel de Parede',
    'enabled': 'Ativado',
    'disabled': 'Desativado',
    'visible': 'Visível',
    'hidden': 'Oculto',
    'search': 'Pesquisar...',
    'launchpad': 'Plataforma',
    'settings': 'Definições',
    'about_os': 'Sobre o Web FIFESSO',
    'os_name': 'Web FIFESSO',
    'os_full_name': 'Fixe Incrivel Fixe Epico Super Sistema Operativo',
    'aboutme': 'Sobre Mim',
    'terminal': 'Terminal',
    'paint': 'Pintura',
    'calculator': 'Calculadora',
    'browser': 'Navegador',
    'appmaker': 'Criador de Apps',
    'stonemeni': 'IA de Pedra',
    'sysmon': 'Monitor de Sistema',
    'recyclebin': 'Reciclagem',
    'taskmanager': 'Gestor de Tarefas',
    'windowTransparency': 'Transparência',
    'animationSpeed': 'Velocidade de Animação',
    'systemSound': 'Volume do Sistema',
    'chrome': 'Loja Chrome',
    'claude': 'Cláudio IA',
    'youtube': 'Vídeos',
    'roblox': 'Jogos',
    'cookiesoap': 'Sabonete de Bolacha',
    'dolphin': 'Física de Golfinho',
    'videoplayer': 'Leitor de Vídeo'
  },
  "googoo gaga": {
    'userName': 'Goo Goo Name',
    'profilePic': 'Baby Pic URL',
    'darkMode': 'Nap Time',
    'retroMode': 'Toy Mode',
    'language': 'Baby Talk',
    'pcMode': 'Crib Mode',
    'taskbarPosition': 'Diaper Position',
    'taskbarColor': 'Milk Color',
    'startButton': 'Binky Button',
    'mouseCursor': 'Rattle Style',
    'wallpaper': 'Nursery View',
    'enabled': 'Dada!',
    'disabled': 'Mama!',
    'visible': 'Peek-a-boo!',
    'hidden': 'Gone!',
    'search': 'Find Toy...',
    'launchpad': 'Playpen',
    'settings': 'Rules',
    'about_os': 'Goo Goo Web AICESOS',
    'aboutme': 'The Baby',
    'terminal': 'Crayon',
    'paint': 'Finger Paint',
    'calculator': 'Block Counter',
    'browser': 'Stroller',
    'appmaker': 'Toy Maker',
    'stonemeni': 'Rock Baby AI',
    'sysmon': 'Milk Gauge',
    'recyclebin': 'Diaper Bin',
    'taskmanager': 'Nanny Manager',
    'windowTransparency': 'Clear Bottle',
    'animationSpeed': 'Crawling Speed',
    'systemSound': 'Lullaby Volume',
    'chrome': 'Toy Store',
    'claude': 'Baby Claude',
    'youtube': 'Cartoons',
    'roblox': 'Playground',
    'cookiesoap': 'Baby Soap',
    'dolphin': 'Water Play',
    'videoplayer': 'Picture Book'
  },
  "Broken code": {
    'userName': 'undefined_user',
    'profilePic': 'null_pointer_url',
    'darkMode': '0x000000',
    'retroMode': 'legacy_v1',
    'language': 'syntax_error',
    'pcMode': 'kernel_panic',
    'taskbarPosition': 'stack_overflow',
    'taskbarColor': '#ff0000_error',
    'startButton': 'main()',
    'mouseCursor': 'segmentation_fault',
    'wallpaper': 'buffer_overflow',
    'enabled': 'true',
    'disabled': 'false',
    'visible': 'public',
    'hidden': 'private',
    'search': 'grep pattern...',
    'launchpad': 'exec()',
    'settings': 'config.json',
    'about_os': 'README.md',
    'aboutme': 'LICENSE',
    'terminal': '/bin/bash',
    'paint': 'canvas.draw()',
    'calculator': 'eval()',
    'browser': 'curl -X GET',
    'appmaker': 'compiler',
    'stonemeni': 'LLM_ERROR',
    'sysmon': 'top',
    'recyclebin': '/dev/null',
    'taskmanager': 'ps -aux',
    'windowTransparency': 'alpha_channel',
    'animationSpeed': 'clock_cycle',
    'systemSound': 'beep_frequency'
  },
  "Arabic": {
    'userName': 'اسم المستخدم',
    'profilePic': 'رابط صورة الملف الشخصي',
    'darkMode': 'الوضع الداكن',
    'retroMode': 'الوضع الكلاسيكي',
    'language': 'اللغة',
    'pcMode': 'وضع الكمبيوتر',
    'taskbarPosition': 'موقع شريط المهام',
    'taskbarColor': 'لون شريط المهام',
    'startButton': 'زر البدء',
    'mouseCursor': 'مؤشر الماوس',
    'wallpaper': 'خلفية سطح المكتب',
    'enabled': 'مفعل',
    'disabled': 'معطل',
    'visible': 'مرئي',
    'hidden': 'مخفي',
    'search': 'بحث...',
    'launchpad': 'منصة الإطلاق',
    'settings': 'الإعدادات',
    'about_os': 'حول Web AICESOS',
    'aboutme': 'عني',
    'terminal': 'الطرفية',
    'paint': 'الرسام',
    'calculator': 'الحاسبة',
    'browser': 'المتصفح',
    'appmaker': 'صانع التطبيقات',
    'stonemeni': 'ستونيميني ذكاء اصطناعي',
    'sysmon': 'مراقب النظام',
    'recyclebin': 'سلة المهملات',
    'taskmanager': 'مدير المهام',
    'windowTransparency': 'شفافية النوافذ',
    'animationSpeed': 'سرعة الحركة',
    'systemSound': 'صوت النظام',
    'chrome': 'متجر كروم',
    'claude': 'كلود',
    'youtube': 'يوتيوب',
    'roblox': 'روبلوكس',
    'cookiesoap': 'صابون الكوكيز',
    'dolphin': 'دلفين',
    'videoplayer': 'مشغل الفيديو',
    'calendar': 'التقويم',
    'weather': 'الطقس',
    'stickynotes': 'الملاحظات اللاصقة',
    'musicplayer': 'مشغل الموسيقى',
    'gchat': 'جوجل شات',
    'imageviewer': 'عارض الصور',
    'bowser': 'باوزر',
    'mspomp': 'الآنسة بومب',
    'w3shit': 'دبليو 3 شيت',
    'word': 'وورد',
    'excel': 'إكسل',
    'powerpoint': 'باوربوينت',
    'docs': 'مستندات',
    'slides': 'عروض تقديمية',
    'cydia_fake': 'سيديا مجاني',
    'hydra': 'هيدرا',
    'doge_unlocked': 'دوج مفتوح',
    'talking_horror': 'الرعب المتكلم',
    'bouncyball': 'الكرة النطاطة',
    'balloon': 'احمِ البالون',
    'flappy': 'فلابي بيرد',
    'angrybirds': 'الطيور الغاضبة',
    'flashplayer': 'مشغل فلاش',
    'doge': 'تطبيق سري للغاية',
    'omg': 'يا إلهي.exe',
    'chilled_windows': 'ويندوز بارد',
    'textdocs': 'مستندات نصية',
    'eve': 'إيف أونلاين',
    'fallout': 'فول آوت',
    'reason': 'ريزن',
    'skyrim': 'سكايرم',
    'gog': 'جي أو جي',
    'wizard101': 'ويزارد 101',
    'matlab': 'ماتلاب',
    'sims3': 'سيمز 3',
    'metatrader': 'ميتا تريدر',
    'steam': 'ستيم',
    'outlook': 'أوتلوك',
    'photoshop': 'فوتوشوب'
  },
  "Parody Arabic": {
    'userName': 'اسم الكابتن',
    'profilePic': 'صورة السيلفي',
    'darkMode': 'وضع الليل المظلم',
    'retroMode': 'وضع أيام زمان',
    'language': 'لسانك',
    'pcMode': 'نوع الطيارة',
    'taskbarPosition': 'مكان السجادة',
    'taskbarColor': 'لون الدهان',
    'startButton': 'الزر السحري',
    'mouseCursor': 'شكل السهم',
    'wallpaper': 'المنظر الجميل',
    'enabled': 'شغال يا معلم',
    'disabled': 'طافي',
    'visible': 'باين',
    'hidden': 'منخش',
    'search': 'دور على الكنز...',
    'launchpad': 'منصة الصواريخ',
    'settings': 'التحكم بالعالم',
    'about_os': 'قصة النظام',
    'aboutme': 'مين أنا؟',
    'terminal': 'الشاشة السوداء',
    'paint': 'شخابيط',
    'calculator': 'عداد الفلوس',
    'browser': 'المنظار',
    'appmaker': 'مصنع الاختراعات',
    'stonemeni': 'الحجر المتكلم',
    'sysmon': 'عداد الضغط',
    'recyclebin': 'الزبالة',
    'taskmanager': 'مدير العمال',
    'windowTransparency': 'زجاج شفاف',
    'animationSpeed': 'سرعة البرق',
    'systemSound': 'صوت الراديو',
    'chrome': 'الدكان الكبير',
    'claude': 'المساعد الذكي',
    'youtube': 'تلفزيون النت',
    'roblox': 'عالم الألعاب',
    'cookiesoap': 'صابون البسكويت',
    'dolphin': 'فيزياء السمك',
    'videoplayer': 'شاشة العرض'
  },
  "Chinese": {
    'userName': '用户名',
    'profilePic': '头像链接',
    'darkMode': '深色模式',
    'retroMode': '复古模式',
    'language': '语言',
    'pcMode': '电脑模式',
    'taskbarPosition': '任务栏位置',
    'taskbarColor': '任务栏颜色',
    'startButton': '开始按钮',
    'mouseCursor': '鼠标指针',
    'wallpaper': '桌面壁纸',
    'enabled': '已启用',
    'disabled': '已禁用',
    'visible': '可见',
    'hidden': '隐藏',
    'search': '搜索...',
    'launchpad': '启动台',
    'settings': '设置',
    'about_os': '关于 Web AICESOS',
    'aboutme': '关于我',
    'terminal': '终端',
    'paint': '画图',
    'calculator': '计算器',
    'browser': '浏览器',
    'appmaker': '应用制作器',
    'stonemeni': 'Stonemeni 智能',
    'sysmon': '系统监视器',
    'recyclebin': '回收站',
    'taskmanager': '任务管理器',
    'windowTransparency': '窗口透明度',
    'animationSpeed': '动画速度',
    'systemSound': '系统声音',
    'chrome': 'Chrome 商店',
    'claude': 'Claude',
    'youtube': 'YouTube',
    'roblox': 'Roblox',
    'cookiesoap': '饼干肥皂',
    'dolphin': '海豚物理',
    'videoplayer': '视频播放器',
    'calendar': '日历',
    'weather': '天气',
    'stickynotes': '便签',
    'musicplayer': '音乐播放器',
    'gchat': '谷歌聊天',
    'imageviewer': '图片查看器',
    'bowser': '库巴',
    'mspomp': '庞普小姐',
    'w3shit': 'w3SHIT',
    'word': 'Word',
    'excel': 'Excel',
    'powerpoint': 'PowerPoint',
    'docs': '文档',
    'slides': '幻灯片',
    'cydia_fake': '免费 Cydia',
    'hydra': '九头蛇',
    'doge_unlocked': '狗狗币解锁',
    'talking_horror': '恐怖对话',
    'bouncyball': '弹力球',
    'balloon': '保护气球',
    'flappy': '像素鸟',
    'angrybirds': '愤怒的小鸟',
    'flashplayer': 'Flash 播放器',
    'doge': '绝密应用',
    'omg': '我的天.exe',
    'chilled_windows': '冷静的 Windows',
    'textdocs': '文本编辑',
    'eve': '星战前夜',
    'fallout': '辐射',
    'reason': 'Reason',
    'skyrim': '天际',
    'gog': 'GOG 平台',
    'wizard101': '魔法 101',
    'matlab': 'Matlab',
    'sims3': '模拟人生 3',
    'metatrader': 'MetaTrader 5',
    'steam': 'Steam',
    'outlook': 'Outlook',
    'photoshop': 'Photoshop'
  },
  'FUCKY LANGUAGE': {
    'win9': 'SHITTY WINDOWS 9',
    'vmware': 'VIRTUAL SHIT',
    'userName': 'WHO THE FUCK ARE YOU?',
    'profilePic': 'UGLY ASS PIC URL',
    'darkMode': 'PITCH BLACK SHIT',
    'retroMode': 'OLD CRAP MODE',
    'language': 'WHAT THE FUCK LANGUAGE',
    'pcMode': 'SHITTY PC MODE',
    'taskbarPosition': 'WHERE THE FUCK IS THE BAR',
    'taskbarColor': 'SHIT COLOR',
    'startButton': 'THE FUCKING START BUTTON',
    'mouseCursor': 'STUPID CURSOR',
    'wallpaper': 'SHITTY WALLPAPER',
    'enabled': 'FUCKING ON',
    'disabled': 'FUCKING OFF',
    'visible': 'I SEE YOU',
    'hidden': 'WHERE THE FUCK DID IT GO',
    'search': 'SEARCHING FOR SHIT...',
    'launchpad': 'THE FUCKING CLOSET',
    'settings': 'FIX THIS SHIT',
    'about_os': 'Web AICESOS GOSSIP',
    'aboutme': 'MY SHITTY BIO',
    'terminal': 'SECRET SHIT DIARY',
    'paint': 'SHITTY ART CLASS',
    'calculator': 'MATH IS SHIT',
    'browser': 'SHOPPING FOR SHIT',
    'appmaker': 'SHITTY BOUTIQUE',
    'stonemeni': 'BESTIE SHIT AI',
    'sysmon': 'VIBE SHIT CHECK',
    'recyclebin': 'TRASH SHIT CAN',
    'taskmanager': 'DRAMA SHIT MANAGER',
    'windowTransparency': 'GLASSY SHIT VIBES',
    'animationSpeed': 'SLAY SHIT SPEED',
    'systemSound': 'SHITTY MUSIC VOLUME',
    'chrome': 'PINK SHIT STORE',
    'claude': 'SMART SHIT BESTIE',
    'cydia': 'JAILBREAK SHIT',
    'youtube': 'VLOG SHIT TUBE',
    'roblox': 'ROBLOX SHIT',
    'cookiesoap': 'SWEET SHIT FILTER',
    'dolphin': 'GRAVITY SHIT SPLASH',
    'videoplayer': 'MOVIE SHIT NIGHT',
    'error_remix': 'OOPSIE SHIT REMIX',
    'boxbuddy': 'SHITTY BUDDY',
    'nesplayer': 'RETRO SHIT GAMES',
    'winxphorror': 'SPOOKY SHIT XP',
    'wine': 'DRINKY SHITS',
    'utorrent': 'TORRENT SHITS',
    '000': '000.SHIT',
    'steam': 'GAME SHIT CLUB',
    'outlook': 'MAIL SHIT',
    'eve': 'SPACE SHIT DRAMA',
    'photoshop': 'FILTER SHIT SHOP',
    'fallout': 'WASTELAND SHIT',
    'reason': 'MUSIC SHIT MAKER',
    'skyrim': 'DRAGON SHIT QUEST',
    'gog': 'GAME SHITS',
    'wizard101': 'MAGIC SHIT SCHOOL',
    'matlab': 'MATH SHIT',
    'sims3': 'SIMS SHIT 3',
    'metatrader': 'MONEY SHIT',
    'pc': 'MY SHITTY PC',
    'calendar': 'DATE SHITS',
    'weather': 'SUN & SHITTY RAIN',
    'stickynotes': 'PINK SHIT NOTES',
    'musicplayer': 'PLAYLIST SHITS',
    'gchat': 'BESTIE SHIT CHAT',
    'imageviewer': 'GALLERY SHIT',
    'bowser': 'BOWSER SHIT',
    'mspomp': 'TEACHER SHIT',
    'w3shit': 'w3SHITTY SHIT',
    'word': 'DIARY SHIT',
    'excel': 'BUDGET SHIT',
    'powerpoint': 'SLIDESHOW SHIT',
    'docs': 'NOTE SHITS',
    'slides': 'PRESENTATION SHIT',
    'cydia_fake': 'FAKE SHIT CYDIA',
    'hydra': 'hydra.SHIT',
    'doge_unlocked': 'DOGE SHIT',
    'talking_horror': 'HORROR SHIT',
    'bouncyball': 'BALL SHIT',
    'balloon': 'BALLOON SHIT',
    'flappy': 'BIRD SHIT',
    'angrybirds': 'BIRD SHITS',
    'flashplayer': 'FLASH SHIT',
    'doge': 'VERY SECRET SHIT',
  }
};

const Window = ({ id, title, icon, defaultStyle, children, contentStyle = {}, onDrop, onDragOver }: any) => {
  const { activeWindows, maximizedState, windowPositions, windowZIndices, highestZIndex, bringToFront, closeWindow, toggleMaximize, setDragging, dragging, windowTransparency, animationSpeed, t } = useContext(OSContext);
  
  if (!activeWindows[id]) return null;
  
  const isMaximized = maximizedState[id];
  const pos = windowPositions[id] || { x: defaultStyle.left, y: defaultStyle.top };
  const zIndex = windowZIndices[id] || highestZIndex;
  
  const style = isMaximized 
    ? { top: 0, left: 0, width: '100vw', height: 'calc(100vh - 50px)', zIndex, opacity: windowTransparency, transition: `all ${animationSpeed}s ease-in-out` }
    : { ...defaultStyle, top: pos.y, left: pos.x, zIndex, opacity: windowTransparency, transition: `all ${animationSpeed}s ease-in-out` };

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.btn')) return;
    bringToFront(id);
    const win = document.getElementById(id);
    if (win) {
      const rect = win.getBoundingClientRect();
      setDragging({
        id,
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      });
    }
  };

  return (
    <div 
      className={`window active ${dragging?.id === id ? 'dragging' : ''}`} 
      id={id} 
      style={style} 
      onMouseDown={() => bringToFront(id)}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="title-bar" onMouseDown={handleTitleMouseDown}>
        <div className="title-text"><img src={icon || undefined} alt="icon" /> {title}</div>
        <div className="controls">
          <button className="btn btn-min" onClick={() => closeWindow(id)}></button>
          <button className="btn btn-max" onClick={() => toggleMaximize(id)}></button>
          <button className="btn btn-close" onClick={() => closeWindow(id)}></button>
        </div>
      </div>
      <div className="content" style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

const BouncyBallGame = ({ isActive }: { isActive: boolean }) => {
  const { debugSettings } = useContext(OSContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ bx: 150, by: 50, bvx: 3, bvy: 0 });

  useEffect(() => {
    if (!isActive || debugSettings?.noComplexJs) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgBall = new Image();
    imgBall.src = "https://files.softicons.com/download/system-icons/project-icons-by-bogo-d/png/32/Color%20Wheel.png";

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, 300, 380);
      const s = state.current;
      s.bvy += 0.5; s.bx += s.bvx; s.by += s.bvy;
      if(s.by + 20 > 380) { s.by = 360; s.bvy *= -0.8; }
      if(s.bx + 20 > 300) { s.bx = 280; s.bvx *= -0.8; }
      if(s.bx - 20 < 0) { s.bx = 20; s.bvx *= -0.8; }
      ctx.drawImage(imgBall, s.bx - 20, s.by - 20, 40, 40);
      animationId = requestAnimationFrame(draw);
    };
    
    imgBall.onload = () => {
      draw();
    };

    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  const handleMouseDown = () => {
    state.current.bvy = -12;
    state.current.bvx = (Math.random() - 0.5) * 15;
  };

  if (debugSettings?.noComplexJs) {
    return <div className="w-[300px] h-[380px] bg-gray-800 text-white flex items-center justify-center p-4 text-center border border-gray-600">Complex JS Disabled in Debug Mode</div>;
  }

  return <canvas ref={canvasRef} width={300} height={380} onMouseDown={handleMouseDown} style={{ background: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070') center/cover", cursor: 'pointer', border: '1px solid var(--border-color)' }} />;
};

const ProtectBalloonGame = ({ isActive }: { isActive: boolean }) => {
  const { debugSettings } = useContext(OSContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ px: 150, py: 330, pSpikes: [] as any[], pScore: 0, pOver: false, pFrames: 0 });

  useEffect(() => {
    if (!isActive || debugSettings?.noComplexJs) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgBalloon = new Image(); imgBalloon.src = "https://files.softicons.com/download/toolbar-icons/fatcow-hosting-icons-by-fatcow/png/32/baloon.png";
    const imgSpike = new Image(); imgSpike.src = "https://static.wikia.nocookie.net/scribblenauts/images/8/8d/Steel_Spike.png/revision/latest?cb=20130105173440";

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, 300, 380);
      const s = state.current;
      
      if(s.pOver) { 
        ctx.fillStyle='black'; ctx.font='20px Arial'; ctx.fillText("Popped! Score: "+s.pScore, 60, 190); 
        ctx.font='14px Arial'; ctx.fillText("Click to restart", 100, 220); 
        animationId = requestAnimationFrame(draw);
        return; 
      }
      
      s.pFrames++; 
      if(s.pFrames % 35 === 0) s.pSpikes.push({x: Math.random()*280, y: -20, v: 2 + Math.random()*4});
      
      ctx.drawImage(imgBalloon, s.px - 20, s.py - 20, 40, 40);
      
      for(let i=0; i<s.pSpikes.length; i++) {
          let spike = s.pSpikes[i]; spike.y += spike.v; 
          ctx.drawImage(imgSpike, spike.x - 5, spike.y, 20, 30); 
          let dx = s.px - (spike.x+5), dy = s.py - (spike.y+12);
          if(Math.sqrt(dx*dx + dy*dy) < 25) s.pOver = true;
          if(spike.y > 380 && !spike.scored) { spike.scored = true; s.pScore++; }
      }
      
      ctx.fillStyle='black'; ctx.font='16px Arial'; ctx.fillText("Score: " + s.pScore, 10, 25);
      animationId = requestAnimationFrame(draw);
    };

    let loaded = 0;
    const start = () => { loaded++; if(loaded === 2) draw(); };
    imgBalloon.onload = start;
    imgSpike.onload = start;

    return () => cancelAnimationFrame(animationId);
  }, [isActive]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    state.current.px = e.clientX - rect.left;
  };

  const handleMouseDown = () => {
    if (state.current.pOver) {
      state.current = { px: 150, py: 330, pSpikes: [], pScore: 0, pOver: false, pFrames: 0 };
    }
  };

  if (debugSettings?.noComplexJs) {
    return <div className="w-[300px] h-[380px] bg-gray-800 text-white flex items-center justify-center p-4 text-center border border-gray-600">Complex JS Disabled in Debug Mode</div>;
  }

  return <canvas ref={canvasRef} width={300} height={380} onMouseMove={handleMouseMove} onMouseDown={handleMouseDown} style={{ background: '#87CEEB', cursor: 'none', border: '1px solid var(--border-color)' }} />;
};

const FlappyBirdGame = ({ isActive }: { isActive: boolean }) => {
  const { debugSettings } = useContext(OSContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ fY: 150, fV: 0, fPipes: [] as any[], fScore: 0, fOver: false, fFrames: 0 });

  const flap = () => {
     if(state.current.fOver){ 
         state.current = { fY: 150, fV: 0, fPipes: [], fScore: 0, fOver: false, fFrames: 0 };
     } else {
         state.current.fV = -6; 
     }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isActive && !debugSettings?.noComplexJs) flap();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, debugSettings?.noComplexJs]);

  useEffect(() => {
    if (!isActive || debugSettings?.noComplexJs) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgFlappy = new Image(); imgFlappy.src = "https://img.itch.zone/aW1nLzIwNTA5MzAyLnBuZw==/original/YDV4t2.png";
    const imgPipeBig = new Image(); imgPipeBig.src = "https://www.pngall.com/wp-content/uploads/15/Mario-Pipe-PNG-Cutout.png";
    const imgPipeSmol = new Image(); imgPipeSmol.src = "https://static.wikia.nocookie.net/super-mario-maker-2-wiki/images/b/b9/Pipe.png/revision/latest?cb=20200724020908";

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, 300, 380);
      const s = state.current;

      if(s.fOver) { 
        ctx.fillStyle='black'; ctx.font='20px Arial'; ctx.fillText("Game Over! Score: "+s.fScore, 60, 190); 
        ctx.fillText("Click to restart", 80, 220); 
        animationId = requestAnimationFrame(draw);
        return; 
      }

      s.fFrames++; s.fV += 0.4; s.fY += s.fV;
      ctx.drawImage(imgFlappy, 40, s.fY - 5, 35, 30); 

      if(s.fFrames % 90 === 0) {
          let h = Math.random() * 150 + 50;
          s.fPipes.push({x: 300, y: 0, w: 40, h: h}); 
          s.fPipes.push({x: 300, y: h+120, w: 40, h: 380 - h - 120}); 
      }

      for(let i=0; i<s.fPipes.length; i++) {
          let p = s.fPipes[i]; p.x -= 2; 
          if (p.y === 0) {
              ctx.save(); ctx.translate(p.x + p.w/2, p.y + p.h); ctx.scale(1, -1);
              ctx.drawImage(imgPipeSmol, -p.w/2, 0, p.w, p.h); ctx.restore();
          } else { 
              ctx.drawImage(imgPipeBig, p.x, p.y, p.w, p.h); 
          }
          if(50 < p.x+p.w && 70 > p.x && s.fY < p.y+p.h && s.fY+20 > p.y) s.fOver = true;
          if(p.x === 50 && p.y === 0) s.fScore++;
      }

      if(s.fY > 380 || s.fY < 0) s.fOver = true;
      ctx.fillStyle='black'; ctx.font='16px Arial'; ctx.fillText("Score: " + s.fScore, 10, 25);
      
      animationId = requestAnimationFrame(draw);
    };

    let loaded = 0;
    const start = () => { loaded++; if(loaded === 3) draw(); };
    imgFlappy.onload = start;
    imgPipeBig.onload = start;
    imgPipeSmol.onload = start;

    return () => cancelAnimationFrame(animationId);
  }, [isActive, debugSettings?.noComplexJs]);

  if (debugSettings?.noComplexJs) {
    return <div className="w-[300px] h-[380px] bg-gray-800 text-white flex items-center justify-center p-4 text-center border border-gray-600">Complex JS Disabled in Debug Mode</div>;
  }

  return <canvas ref={canvasRef} width={300} height={380} onMouseDown={flap} style={{ background: '#70c5ce', cursor: 'pointer', border: '1px solid var(--border-color)' }} />;
};

const TextDocsApp = () => {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Add to history if different
    if (newText !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newText);
      // Limit history size
      if (newHistory.length > 50) newHistory.shift();
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-gray-100 border-b border-gray-300 p-1 gap-1">
        <button 
          onClick={undo} 
          disabled={historyIndex === 0}
          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Undo
        </button>
        <button 
          onClick={redo} 
          disabled={historyIndex === history.length - 1}
          className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
        >
          Redo
        </button>
      </div>
      <textarea 
        className="flex-grow w-full border-none p-5 resize-none font-mono bg-[var(--win-bg)] text-[var(--win-text)] outline-none" 
        placeholder="Start typing..."
        value={text}
        onChange={handleTextChange}
        onKeyDown={(e) => {
          if (e.ctrlKey && e.key === 'z') {
            e.preventDefault();
            undo();
          } else if (e.ctrlKey && e.key === 'y') {
            e.preventDefault();
            redo();
          }
        }}
      ></textarea>
    </div>
  );
};

const AngryBirdsGame = ({ isActive }: { isActive: boolean }) => {
  const { debugSettings } = useContext(OSContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [needHydration, setNeedHydration] = useState(false);
  const state = useRef({ 
    birdX: 50, birdY: 250, birdVx: 0, birdVy: 0, 
    isDragging: false, isFlying: false,
    pigs: [{x: 250, y: 300, alive: true}, {x: 250, y: 250, alive: true}, {x: 200, y: 300, alive: true}],
    score: 0,
    birdType: 0, // 0: red, 1: blue, 2: yellow, 3: plane
    missedCount: 0,
    hitPigThisTurn: false
  });

  const birdImages = [
    "https://files.softicons.com/download/game-icons/angry-birds-icons-by-sirea/png/48x48/Bird-red.png",
    "https://files.softicons.com/download/game-icons/angry-birds-icons-by-sirea/png/48x48/Bird-blue.png",
    "https://files.softicons.com/download/game-icons/angry-birds-icons-by-sirea/png/48x48/Bird-yellow.png",
    "https://files.softicons.com/download/object-icons/elements-alone-icons-by-babasse/png/48/Plane.png"
  ];

  useEffect(() => {
    if (!isActive || debugSettings?.noComplexJs) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgs = birdImages.map(src => { const img = new Image(); img.src = src; return img; });

    let animationId: number;
    const loop = () => {
      ctx.clearRect(0, 0, 300, 380);
      
      // Draw ground
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(0, 330, 300, 50);
      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, 330, 300, 10);

      // Draw slingshot
      ctx.strokeStyle = '#5c3a21';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(50, 330);
      ctx.lineTo(50, 270);
      ctx.stroke();

      const s = state.current;

      // Physics
      if (s.isFlying) {
        s.birdVy += 0.5; // gravity
        s.birdX += s.birdVx;
        s.birdY += s.birdVy;

        // Collision with ground
        if (s.birdY > 310) {
          s.birdY = 310;
          s.birdVx *= 0.5;
          s.birdVy *= -0.5;
          if (Math.abs(s.birdVx) < 0.1) {
            // Reset bird
            setTimeout(() => {
              if (state.current.isFlying) {
                if (!state.current.hitPigThisTurn) {
                  state.current.missedCount++;
                  if (state.current.missedCount >= 3) {
                    setNeedHydration(true);
                  }
                }
                state.current.isFlying = false;
                state.current.hitPigThisTurn = false;
                state.current.birdX = 50;
                state.current.birdY = 250;
                state.current.birdType = (state.current.birdType + 1) % 4;
              }
            }, 1000);
          }
        }

        // Collision with pigs
        s.pigs.forEach(pig => {
          if (pig.alive) {
            const dx = s.birdX - pig.x;
            const dy = s.birdY - pig.y;
            if (Math.sqrt(dx*dx + dy*dy) < 30) {
              pig.alive = false;
              s.score += 100;
              s.hitPigThisTurn = true;
            }
          }
        });
      }

      // Draw pigs
      s.pigs.forEach(pig => {
        if (pig.alive) {
          ctx.fillStyle = '#32CD32';
          ctx.beginPath();
          ctx.arc(pig.x, pig.y, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw bird
      const img = imgs[s.birdType];
      if (img.complete) {
        ctx.drawImage(img, s.birdX - 15, s.birdY - 15, 30, 30);
      } else {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(s.birdX, s.birdY, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw sling band
      if (s.isDragging) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(50, 270);
        ctx.lineTo(s.birdX, s.birdY);
        ctx.stroke();
      }

      // Score
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`Score: ${s.score}`, 10, 20);

      animationId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationId);
  }, [isActive, debugSettings?.noComplexJs]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = state.current;
    if (!s.isFlying && Math.abs(x - s.birdX) < 30 && Math.abs(y - s.birdY) < 30) {
      s.isDragging = true;
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const s = state.current;
    if (s.isDragging) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      s.birdX = e.clientX - rect.left;
      s.birdY = e.clientY - rect.top;
    }
  };

  const handleMouseUp = () => {
    const s = state.current;
    if (s.isDragging) {
      s.isDragging = false;
      s.isFlying = true;
      s.birdVx = (50 - s.birdX) * 0.2;
      s.birdVy = (270 - s.birdY) * 0.2;
    }
  };

  if (debugSettings?.noComplexJs) {
    return <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 p-4 text-center">Complex JS Disabled in Debug Menu</div>;
  }

  return (
    <div className="relative w-[300px] h-[380px]">
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={380} 
        onMouseDown={handleMouseDown} 
        onMouseMove={handleMouseMove} 
        onMouseUp={handleMouseUp} 
        onMouseLeave={handleMouseUp} 
        style={{ background: '#87CEEB', cursor: 'crosshair', border: '1px solid var(--border-color)' }} 
      />
      {needHydration && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4 text-center z-10">
          <h2 className="text-xl font-bold mb-2">Need to hydrate!</h2>
          <p className="text-sm mb-4">You've missed too many birds. Take a break and drink some water!</p>
          <button 
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded font-bold transition-colors"
            onClick={() => {
              state.current.missedCount = 0;
              setNeedHydration(false);
            }}
          >
            Drink Water 💧
          </button>
        </div>
      )}
    </div>
  );
};

const SystemMonitorApp = () => {
  const [stats, setStats] = useState({ cpu: 0, ram: 0, disk: 0, cores: 0, maxRam: 0, maxDisk: 0 });

  useEffect(() => {
    let isMounted = true;
    const updateStats = async () => {
      const cores = navigator.hardwareConcurrency || 4;
      const maxRam = (navigator as any).deviceMemory || 8;
      
      let diskUsed = 0;
      let diskTotal = 100 * 1024 * 1024 * 1024; // 100GB fallback
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const estimate = await navigator.storage.estimate();
          diskUsed = estimate.usage || 0;
          diskTotal = estimate.quota || diskTotal;
        } catch (e) {}
      }

      if (isMounted) {
        setStats({
          cpu: Math.floor(Math.random() * 30) + 10, // Simulate fluctuating CPU
          ram: Math.floor(Math.random() * 20) + 40, // Simulate 40-60% RAM usage
          disk: (diskUsed / diskTotal) * 100,
          cores,
          maxRam,
          maxDisk: diskTotal
        });
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => { isMounted = false; clearInterval(interval); };
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4 h-full bg-[var(--win-bg)] text-[var(--win-text)]">
      <h2 className="text-xl font-bold mb-2">System Monitor</h2>
      
      <div>
        <div className="flex justify-between mb-1">
          <span>CPU Usage ({stats.cores} Cores)</span>
          <span>{stats.cpu}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded h-4 overflow-hidden">
          <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${stats.cpu}%` }}></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <span>Memory Usage ({stats.maxRam} GB)</span>
          <span>{stats.ram}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded h-4 overflow-hidden">
          <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${stats.ram}%` }}></div>
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-1">
          <span>Disk Space ({(stats.maxDisk / (1024*1024*1024)).toFixed(1)} GB)</span>
          <span>{stats.disk.toFixed(2)}%</span>
        </div>
        <div className="w-full bg-gray-300 rounded h-4 overflow-hidden">
          <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${stats.disk}%` }}></div>
        </div>
      </div>
    </div>
  );
};

const ImageViewerApp = () => {
  const { selectedImage, setWallpaper, showNotification } = useContext(OSContext);
  const [filter, setFilter] = useState('none');
  
  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Grayscale', value: 'grayscale(100%)' },
    { name: 'Sepia', value: 'sepia(100%)' },
    { name: 'Invert', value: 'invert(100%)' },
    { name: 'Contrast', value: 'contrast(200%)' },
    { name: 'Blur', value: 'blur(5px)' },
    { name: 'Hue Rotate', value: 'hue-rotate(90deg)' },
    { name: 'Brightness', value: 'brightness(150%)' },
    { name: 'Saturate', value: 'saturate(200%)' },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#111] text-white">
      <div className="p-2 bg-[#222] border-b border-[#333] flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-gray-400 uppercase font-bold">Filter:</span>
          <select 
            className="bg-[#333] text-white text-xs px-2 py-1 rounded outline-none border border-[#444] focus:border-blue-500 transition-colors"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {filters.map(f => (
              <option key={f.value} value={f.value}>{f.name}</option>
            ))}
          </select>
          {selectedImage && (
            <button 
              className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors font-bold ml-2"
              onClick={() => {
                setWallpaper(selectedImage);
                showNotification("Wallpaper updated successfully!");
              }}
            >
              Set as Wallpaper
            </button>
          )}
        </div>
        {filter !== 'none' && (
          <button 
            onClick={() => setFilter('none')}
            className="text-[10px] bg-red-900/30 hover:bg-red-900/50 text-red-400 px-2 py-1 rounded transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex-grow flex items-center justify-center overflow-hidden p-4">
        {selectedImage ? (
          <img 
            src={selectedImage} 
            alt="Viewed" 
            className="max-w-full max-h-full object-contain shadow-2xl transition-all duration-500 ease-in-out" 
            style={{ filter }}
          />
        ) : (
          <div className="flex flex-col items-center gap-4 opacity-30">
            <img src="https://files.softicons.com/download/system-icons/oxygen-icons-by-oxygen/png/48x48/mimetypes/image_x_dds.png" className="w-16 h-16 grayscale" />
            <div className="text-sm font-medium">No image selected</div>
          </div>
        )}
      </div>
    </div>
  );
};

const CryForMeApp = () => {
  return (
    <div className="flex flex-col h-full bg-black text-white p-6 font-serif overflow-auto relative">
      <div className="flex flex-col items-center justify-center gap-6 z-10">
        <h1 className="text-4xl font-bold text-center text-red-500 mb-4 tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">ASCEND</h1>
        
        <div className="relative rounded-xl overflow-hidden border-4 border-purple-800 shadow-[0_0_30px_rgba(128,0,128,0.6)]">
          <img src="https://media.tenor.com/ry7vDwNkJs0AAAAM/spongebob-ascend.gif" alt="Spongebob Ascend" className="w-64 h-64 object-cover" />
        </div>

        <div className="mt-4">
          <iframe src="https://www.myinstants.com/instant/i-want-you-crying-for-me-roblox-sfx-4068/embed/" width="110" height="200" frameBorder="0" scrolling="no" className="mx-auto bg-white rounded-lg shadow-lg opacity-90 hover:opacity-100 transition-opacity"></iframe>
        </div>
        
        <div className="bg-gray-900/80 p-6 rounded-lg text-center space-y-4 max-w-md border border-gray-700 mt-2 shadow-2xl backdrop-blur-sm">
          <p className="text-xl font-medium italic animate-pulse text-purple-300">I want you crying for me</p>
          <p className="text-lg text-gray-300">I want you, I want you</p>
          <p className="text-yellow-400 font-bold tracking-widest">Well well well well</p>
          <p className="text-yellow-500 font-bold tracking-widest text-lg">Well well well well</p>
          <p className="text-xl font-medium italic text-purple-300 transition-colors duration-1000 hover:text-red-400">I want you fighting for me</p>
          <p className="text-lg text-gray-300">And when you all lose</p>
          <p className="text-yellow-600 font-bold tracking-widest text-xl drop-shadow-md">well well well well</p>
          <p className="text-2xl font-bold text-red-500 tracking-wider">Well well , Cry for me</p>
        </div>
      </div>
      
      {/* Background ambient effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-black/80 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent"></div>
    </div>
  );
};

const SimulatedAppContent = ({ app }: { app: any }) => {
  const { t } = useContext(OSContext);
  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="bg-white p-4 border-b flex items-center gap-4">
        <img src={app.icon} alt={app.name} className="w-12 h-12 rounded-xl shadow-sm" referrerPolicy="no-referrer" />
        <div>
          <h2 className="text-xl font-bold">{app.name}</h2>
          <p className="text-sm text-gray-500">{app.description || app.desc}</p>
        </div>
      </div>
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl mb-4 mx-auto shadow-lg animate-pulse">
            <img src={app.icon} alt="icon" className="w-12 h-12" referrerPolicy="no-referrer" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Welcome to {app.name}</h3>
          <p className="text-gray-600 mb-6">
            This is a fully integrated {t('os_name')} version of {app.name}. 
            All your data is synced and ready to go!
          </p>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-white rounded-lg shadow-sm border hover:border-blue-500 transition-all">
              <div className="font-bold">Dashboard</div>
              <div className="text-xs text-gray-400">View your activity</div>
            </button>
            <button className="p-4 bg-white rounded-lg shadow-sm border hover:border-blue-500 transition-all">
              <div className="font-bold">Settings</div>
              <div className="text-xs text-gray-400">Manage account</div>
            </button>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100 text-blue-700 text-sm">
            System Status: <span className="font-bold">Operational</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-2 border-t text-[10px] text-gray-400 flex justify-between px-4">
        <span>{t('os_name')} INTEGRATED APP v1.0</span>
        <span>SECURE CONNECTION</span>
      </div>
    </div>
  );
};

const Win7Widgets = () => {
  const { activeWidgets } = useContext(OSContext);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const [playingSong, setPlayingSong] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleSong = (url: string) => {
    if (audioRef.current) {
      if (playingSong === url) {
        audioRef.current.pause();
        setPlayingSong(null);
        return;
      } else {
        audioRef.current.pause();
      }
    }
    const audio = new Audio(url);
    audio.play();
    audioRef.current = audio;
    setPlayingSong(url);
    audio.onended = () => setPlayingSong(null);
  };

  const hr = time.getHours();
  const min = time.getMinutes();
  const sec = time.getSeconds();
  const hrDeg = (hr % 12) * 30 + min * 0.5;
  const minDeg = min * 6;
  const secDeg = sec * 6;

  return (
    <div className="fixed right-6 top-10 flex flex-col gap-6 z-40 pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar pb-10">
      {/* Analog Clock Widget */}
      {activeWidgets.clock && (
        <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/40 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative flex-shrink-0 flex items-center justify-center">
          <div className="absolute w-2 h-2 bg-black rounded-full z-10" />
          <div className="absolute bg-black w-[4px] h-[30%] origin-bottom rounded-t-full" style={{ bottom: '50%', transform: `rotate(${hrDeg}deg)` }} />
          <div className="absolute bg-gray-800 w-[2px] h-[40%] origin-bottom rounded-t-full" style={{ bottom: '50%', transform: `rotate(${minDeg}deg)` }} />
          <div className="absolute bg-red-500 w-[1px] h-[45%] origin-bottom rounded-t-full" style={{ bottom: '50%', transform: `rotate(${secDeg}deg)` }} />
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute w-full h-full p-1" style={{ transform: `rotate(${i * 30}deg)` }}>
              <div className="w-1 h-3 mx-auto bg-black/60 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Media Player Widget */}
      {activeWidgets.media && (
        <div className="w-40 bg-black/50 backdrop-blur-xl rounded-lg border border-white/20 shadow-xl overflow-hidden p-3 text-white flex flex-col gap-3 flex-shrink-0">
          <h3 className="text-xs font-bold text-center border-b border-white/20 pb-1 flex items-center justify-center gap-1">
            <img src="https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/amarok.png" className="w-4 h-4" /> 
            Gadget Media
          </h3>
          <button 
            onClick={() => toggleSong('https://www.myinstants.com/media/sounds/i-want-you-crying-for-me-roblox-sfx-4068.mp3')}
            className={`px-2 py-1 text-[10px] uppercase font-bold rounded border transition-colors ${playingSong === 'https://www.myinstants.com/media/sounds/i-want-you-crying-for-me-roblox-sfx-4068.mp3' ? 'bg-red-600 border-red-500 shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}`}
          >
            {playingSong === 'https://www.myinstants.com/media/sounds/i-want-you-crying-for-me-roblox-sfx-4068.mp3' ? '🛑 Stop Cry For Me' : '▶️ Play Cry For Me'}
          </button>
          <button 
            onClick={() => toggleSong('https://www.myinstants.com/media/sounds/most-long-music-button-in-myinstants.mp3')}
            className={`px-2 py-1 text-[10px] uppercase font-bold rounded border transition-colors ${playingSong === 'https://www.myinstants.com/media/sounds/most-long-music-button-in-myinstants.mp3' ? 'bg-blue-600 border-blue-500 shadow-[0_0_10px_rgba(0,0,255,0.5)]' : 'bg-gray-800 border-gray-600 hover:bg-gray-700'}`}
          >
            {playingSong === 'https://www.myinstants.com/media/sounds/most-long-music-button-in-myinstants.mp3' ? '🛑 Stop Coolest Song' : '▶️ Play Coolest Song'}
          </button>
        </div>
      )}

      {/* Calendar Widget */}
      {activeWidgets.calendar && (
        <div className="w-40 bg-orange-600/90 backdrop-blur-xl rounded-lg shadow-xl overflow-hidden text-white flex flex-col border border-orange-500/50 flex-shrink-0">
          <div className="bg-gradient-to-b from-orange-500 to-orange-800 text-center text-sm py-1 font-bold border-b border-orange-900/50">
            {time.toLocaleString('default', { month: 'long' })} {time.getFullYear()}
          </div>
          <div className="py-4 text-center text-5xl font-bold bg-white text-black bg-gradient-to-b from-gray-100 to-gray-300">
            {time.getDate()}
          </div>
          <div className="text-center text-xs py-1 bg-black/80 font-medium">
            {time.toLocaleString('default', { weekday: 'long' })}
          </div>
        </div>
      )}

      {/* Images Gadgets */}
      {activeWidgets.photosynth && (
        <div className="w-40 rounded-lg overflow-hidden border border-white/20 shadow-xl bg-black/20 flex-shrink-0">
          <img src="https://web.archive.org/web/20130503214753im_/http://i.microsoft.com/global/En/us/PublishingImages/SLWindowPane/en-us_Photosynth_Green_Acct_F.jpg" alt="Photosynth" className="w-full h-auto" referrerPolicy="no-referrer" />
        </div>
      )}

      {activeWidgets.yahoo1 && (
        <div className="w-40 rounded-lg overflow-hidden border border-white/20 shadow-xl bg-black/20 flex-shrink-0">
          <img src="https://web.archive.org/web/20100201171155im_/http://l.yimg.com/a/i/mntl/mai/09q3/def_47c17759.jpg" alt="Yahoo 1" className="w-full h-auto" referrerPolicy="no-referrer" />
        </div>
      )}

      {activeWidgets.yahoo2 && (
        <div className="w-40 rounded-lg overflow-hidden border border-white/20 shadow-xl bg-black/20 flex-shrink-0">
          <img src="https://web.archive.org/web/20110603150515im_/http://l.yimg.com/a/i/us/fpad/too/10q3/tb_300x250.jpg" alt="Yahoo 2" className="w-full h-auto" referrerPolicy="no-referrer" />
        </div>
      )}

      {activeWidgets.pepsi && (
        <div className="w-40 rounded-lg overflow-hidden border border-white/20 shadow-xl bg-black/20 flex-shrink-0">
          <img src="https://web.archive.org/web/20030127104212/http://us.a1.yimg.com/us.yimg.com/a/1-/java/promotions/pepsi/030126/wm1.gif" alt="Pepsi Java" className="w-full h-auto" referrerPolicy="no-referrer" />
        </div>
      )}

      {activeWidgets.yahoo3 && (
        <div className="w-40 rounded-lg overflow-hidden border border-white/20 shadow-xl bg-black/20 flex-shrink-0">
          <img src="https://web.archive.org/web/20120229225044im_/http://l.yimg.com/a/i/mntl/aut/09q4/def_aa9d6007.jpg" alt="Yahoo 3" className="w-full h-auto" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
};

const BrowserApp = () => {
  const { selectedUrl } = useContext(OSContext);
  const [urlInput, setUrlInput] = useState(selectedUrl || 'https://www.bing.com');
  const [iframeSrc, setIframeSrc] = useState(selectedUrl || 'https://www.bing.com');

  useEffect(() => {
    if (selectedUrl) {
      setUrlInput(selectedUrl);
      setIframeSrc(selectedUrl);
    }
  }, [selectedUrl]);

  const handleGo = () => {
    let finalUrl = urlInput;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }
    setIframeSrc(finalUrl);
    setUrlInput(finalUrl);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex gap-2 p-2 bg-gray-200 border-b border-gray-300">
        <input
          type="text"
          className="flex-grow px-2 py-1 border border-gray-400 rounded text-black"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
        />
        <button onClick={handleGo} className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Go</button>
      </div>
      <div className="flex-grow bg-white relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xl text-center p-4 z-0">
          0Oops! Iframe got, a lil mad at us..
        </div>
        <iframe src={iframeSrc} className="w-full h-full border-none relative z-10 bg-transparent" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" />
      </div>
    </div>
  );
};

const BowserApp = () => {
  const { playSound } = useContext(OSContext);
  const [urlInput, setUrlInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [wikiData, setWikiData] = useState<{title: string, extract: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [susErrors, setSusErrors] = useState<{id: number, x: number, y: number, msg: string}[]>([]);

  const susKeywords = ['sus', 'virus', 'robux', 'hack', 'darkweb', 'xxx', 'porn', 'free-money', 'download-ram', 'freemoney', 'vbucks'];

  const handleGo = async () => {
    let term = urlInput.trim();
    if (!term) return;
    
    // Remove http://, https://, www., and .com/.org/etc for the search
    term = term.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0];
    
    if (susKeywords.some(k => term.toLowerCase().includes(k))) {
      playSound('error');
      const newErrors = Array.from({ length: 15 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 80,
        y: Math.random() * 80,
        msg: [
          "YOUR COMPUTER HAS VIRUS", 
          "DOWNLOAD MORE RAM NOW", 
          "HOT SINGLES IN YOUR AREA", 
          "FREE ROBUX CLICK HERE", 
          "SYSTEM FAILURE IMMINENT",
          "BOWSER SAYS NO",
          "SUS DETECTED"
        ][Math.floor(Math.random() * 7)]
      }));
      setSusErrors(newErrors);
      return;
    }

    setSearchTerm(term);
    setLoading(true);
    setWikiData(null);
    setSusErrors([]);

    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term)}`);
      if (response.ok) {
        const data = await response.json();
        setWikiData({ title: data.title, extract: data.extract });
      } else {
        setWikiData({ title: term, extract: `Welcome to the official site of ${term}! We are the leading provider of ${term}-related products and services. Our mission is to revolutionize the ${term} industry with cutting-edge innovations.` });
      }
    } catch (e) {
      setWikiData({ title: term, extract: `Welcome to the official site of ${term}! We are the leading provider of ${term}-related products and services. Our mission is to revolutionize the ${term} industry with cutting-edge innovations.` });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex gap-2 p-2 bg-orange-200 border-b border-orange-400">
        <img src="https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/48/Paper%20Bowser.png" className="w-8 h-8" alt="Bowser" />
        <input
          type="text"
          className="flex-grow px-2 py-1 border border-orange-400 rounded text-black"
          value={urlInput}
          onChange={e => setUrlInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Search or enter address..."
        />
        <button onClick={handleGo} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-bold">Roar!</button>
      </div>
      <div className="flex-grow relative overflow-auto" style={{
        backgroundColor: '#f0f0f0',
        backgroundImage: searchTerm ? `url('https://logo.clearbit.com/${searchTerm}.com')` : 'none',
        backgroundSize: '100px 100px',
        backgroundRepeat: 'repeat'
      }}>
        {/* Semi-transparent overlay to make text readable */}
        {searchTerm && <div className="absolute inset-0 bg-white/80 z-0"></div>}
        
        <div className="relative z-10 p-8 max-w-3xl mx-auto mt-10 bg-white shadow-2xl rounded-lg border-4 border-orange-500">
          {loading ? (
            <div className="text-center text-xl font-bold text-orange-600">Bowser is inventing the site...</div>
          ) : wikiData ? (
            <>
              <h1 className="text-4xl font-bold mb-6 text-red-600 border-b-2 border-red-200 pb-2">{wikiData.title}</h1>
              <p className="text-lg leading-relaxed text-gray-800">{wikiData.extract}</p>
              <div className="mt-8 p-4 bg-orange-100 rounded border border-orange-300 text-sm text-orange-800">
                <strong>Bowser says:</strong> I made this site just for you! Bwahaha!
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 text-xl mt-10">
              <img src="https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/48/Paper%20Bowser.png" className="w-32 h-32 mx-auto mb-4 opacity-50" alt="Bowser" />
              Search for something and I'll invent a site for it!
            </div>
          )}
        </div>
      </div>

      {/* Sus Errors */}
      {susErrors.map(err => (
        <div 
          key={err.id} 
          className="absolute bg-gray-200 border-2 border-gray-400 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] flex flex-col z-[9999]"
          style={{ left: `${err.x}%`, top: `${err.y}%`, width: '300px' }}
        >
          <div className="bg-blue-800 text-white px-2 py-1 flex justify-between items-center font-bold text-sm">
            <span>Critical Error</span>
            <button className="bg-gray-300 text-black px-2 hover:bg-red-500 hover:text-white" onClick={() => {
              playSound('click');
              setSusErrors(prev => prev.filter(e => e.id !== err.id));
            }}>X</button>
          </div>
          <div className="p-4 flex items-center gap-4 bg-gray-100 text-black">
            <img src="https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/error.png" className="w-10 h-10" alt="Error" />
            <span className="font-bold">{err.msg}</span>
          </div>
          <div className="p-2 bg-gray-100 flex justify-center border-t border-gray-300">
            <button className="px-6 py-1 bg-gray-300 border border-gray-500 rounded hover:bg-gray-400 text-black" onClick={() => {
              playSound('click');
              setSusErrors(prev => prev.filter(e => e.id !== err.id));
            }}>OK</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const GoogleChatApp = () => {
  const [messages, setMessages] = useState([
    { sender: 'me', text: 'Im so sad today...' },
    { sender: 'pomp', text: 'Darling its ok, Just if you dont mind come back to my lesson cuz... WHYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY' }
  ]);
  const [input, setInput] = useState('');

  const sendMsg = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'me', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'pomp', text: 'Please just do your work darling! 😭' }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="bg-blue-600 text-white p-3 font-bold flex items-center gap-2">
        <img src="https://files.softicons.com/download/social-media-icons/free-social-media-icons-by-designbolts/png/128x128/Google-Chat.png" className="w-6 h-6" />
        Ms Pomp
      </div>
      <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'me' ? 'bg-blue-100 self-end rounded-br-none' : 'bg-gray-200 self-start rounded-bl-none'}`}>
            {msg.sender === 'pomp' && <div className="text-xs text-gray-500 mb-1 font-bold">Ms Pomp</div>}
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-3 bg-white border-t flex gap-2">
        <input 
          type="text" 
          className="flex-grow border rounded px-3 py-2 outline-none focus:border-blue-500" 
          placeholder="Message Ms Pomp..." 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={sendMsg}>Send</button>
      </div>
    </div>
  );
};

const W3ShitApp = ({ onSave }: { onSave: (name: string, content: string) => void }) => {
  const [html, setHtml] = useState('<h1>Hello w3SHIT!</h1>\n<p>Type your HTML here...</p>');
  const [fileName, setFileName] = useState('mysite');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setHtml(event.target?.result as string);
        setFileName(file.name.replace(/\.[^/.]+$/, ""));
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 text-black">
      <div className="flex items-center gap-2 p-2 bg-gray-200 border-b">
        <div className="flex items-center gap-1">
          <input 
            type="text" 
            className="border rounded px-2 py-1 text-xs w-32" 
            value={fileName} 
            onChange={e => setFileName(e.target.value)} 
            placeholder="Filename"
          />
          <span className="text-xs font-bold">.html</span>
        </div>
        
        <label className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 cursor-pointer flex items-center gap-1 ml-2">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
          Upload
          <input type="file" accept=".html,.htm,.txt" className="hidden" onChange={handleFileUpload} />
        </label>

        <button 
          className="bg-purple-600 text-white px-3 py-1 rounded text-xs hover:bg-purple-700 flex items-center gap-1 ml-2"
          onClick={handleDownload}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download
        </button>

        <button 
          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 ml-auto flex items-center gap-1"
          onClick={() => onSave(fileName, html)}
        >
          <img src="https://files.softicons.com/download/toolbar-icons/fatcow-hosting-icons-by-fatcow/png/16/disk.png" alt="save" className="w-3 h-3" />
          Save to Desktop
        </button>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <textarea 
          className="w-1/2 h-full p-2 font-mono text-xs outline-none border-r resize-none bg-[#1e1e1e] text-[#d4d4d4]"
          value={html}
          onChange={e => setHtml(e.target.value)}
          spellCheck={false}
        />
        <div className="w-1/2 h-full bg-white overflow-auto">
          <iframe 
            title="preview"
            srcDoc={html}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};

const PaintApp = ({ onSetWallpaper }: { onSetWallpaper: (url: string) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSetWallpaper = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      onSetWallpaper(canvas.toDataURL('image/png'));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="flex items-center gap-4 p-2 bg-gray-200 border-b">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} />
        <input type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} />
        <button onClick={handleSetWallpaper} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 ml-auto">
          Set as Wallpaper
        </button>
      </div>
      <div className="flex-grow overflow-auto p-4 flex justify-center items-center bg-gray-300">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="bg-white shadow-lg cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
      </div>
    </div>
  );
};

const AboutOSApp = () => {
  const { language, setLanguage, t } = useContext(OSContext);
  const [editMode, setEditMode] = useState(false);
  const [languageMode, setLanguageMode] = useState(false);
  const sections = [
    { title: "What is this?", content: `Welcome to ${t('os_name')} (${t('os_full_name')}), a fully functional operating system simulation running entirely in your browser. Built with React, Tailwind CSS, and a lot of imagination, it brings a desktop-like experience with windows, a file system, and a variety of applications.` },
    { title: "What you can do", content: "File Explorer: Browse the C: drive, manage your Desktop, and open files.\nWeb Browsing: Use the standard Browser or the chaotic Bowser that invents its own sites.\nProductivity: Write documents in Word, manage data in Excel, or create wallpapers in Paint.\nCreativity: Use App Maker to build and publish your own custom apps to the desktop.\nAI Assistant: Chat with Stonemeni AI, your rock-brained companion.\nCustomization: Head to Settings to change your taskbar, cursor, language, and even the entire \"PC Mode\".\nChaos: Run Error Remix or omg if you're feeling brave." },
    { title: "What's New (Release 10.99)", content: `Mac Stars: Added the classic Mac Stars trap from Windows 9.\n1-Click Install: Install all Windows 9 apps with a single click in Settings.\nAbout OS Updates: Added Language Mode and Edit Mode to the About OS app.\nNew Language: Added FUCKY LANGUAGE for those who like it rough.` }
  ];

  const [editableSections, setEditableSections] = useState(sections);

  useEffect(() => {
    setEditableSections(sections);
  }, [language]);

  const updateSection = (index: number, field: string, value: string) => {
    const newSections = [...editableSections];
    (newSections[index] as any)[field] = value;
    setEditableSections(newSections);
  };

  return (
    <div className="p-6 h-full overflow-y-auto bg-gray-50 text-gray-800 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            <img src="https://files.softicons.com/download/application-icons/fluid-icons-by-arrioch/png/128/rocket.png" className="w-10 h-10" alt="OS Logo" />
            {t('about_os')}
          </h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setLanguageMode(!languageMode)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${languageMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Language Mode
            </button>
            <button 
              onClick={() => setEditMode(!editMode)}
              className={`px-3 py-1 rounded text-xs font-bold transition-all ${editMode ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {editMode ? 'Save Mode' : 'Edit Mode'}
            </button>
          </div>
        </div>

        {languageMode && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-bold mb-2 text-blue-700">Quick Language Switcher</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(translations).map(lang => (
                <button 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded text-[10px] border ${language === lang ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {editableSections.map((section, idx) => (
          <section key={idx} className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            {editMode ? (
              <input 
                value={section.title} 
                onChange={(e) => updateSection(idx, 'title', e.target.value)}
                className="text-xl font-semibold mb-3 border-b pb-2 w-full outline-none focus:border-blue-500"
              />
            ) : (
              <h2 className="text-xl font-semibold mb-3 border-b pb-2">{section.title}</h2>
            )}
            
            {editMode ? (
              <textarea 
                value={section.content} 
                onChange={(e) => updateSection(idx, 'content', e.target.value)}
                className="leading-relaxed w-full h-32 p-2 border border-gray-100 rounded outline-none focus:border-blue-500"
              />
            ) : (
              <p className="leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
            )}
          </section>
        ))}

        <section className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-3 border-b pb-2 text-purple-600">Easter Eggs & Secrets</h2>
          <div className="space-y-4">
            <div className="p-3 bg-purple-50 rounded border border-purple-100">
              <span className="font-bold">🎮 Konami Code:</span>
              <p className="text-sm mt-1">Press <code className="bg-gray-200 px-1 rounded">↑ ↑ ↓ ↓ ← → ← → B A</code> on your keyboard to unlock the secret <strong>Doge</strong> app.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-100">
              <span className="font-bold">⌚ TADC Mode:</span>
              <p className="text-sm mt-1">Type <code className="bg-gray-200 px-1 rounded">tadc</code> anywhere on the desktop to enter the <strong>Wacky Watch</strong> mode.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-100">
              <span className="font-bold">📱 Blackberry Mode:</span>
              <p className="text-sm mt-1">Type <code className="bg-gray-200 px-1 rounded">blackberry</code> into the taskbar search bar to transform the OS into a classic phone.</p>
            </div>
            <div className="p-3 bg-purple-50 rounded border border-purple-100">
              <span className="font-bold">🛠️ Debug Menu:</span>
              <p className="text-sm mt-1">Press <code className="bg-gray-200 px-1 rounded">Ctrl + F8</code> to toggle the developer debug menu.</p>
            </div>
          </div>
        </section>
        <footer className="text-center text-gray-400 text-sm mt-10 pb-6">
          {t('os_name')} Release 10.99 - Built with ❤️ and Chaos
        </footer>
      </div>
    </div>
  );
};

const SettingsApp = () => {
  const { 
    userName, setUserName, userPfp, setUserPfp, 
    isDarkMode, setIsDarkMode, isRetroMode, setIsRetroMode, 
    wallpaper, setWallpaper, taskbarColor, setTaskbarColor,
    cursorStyle, setCursorStyle, taskbarPosition, setTaskbarPosition,
    showStartButton, setShowStartButton, language, setLanguage,
    pcMode, setPcMode, debugSettings, setApps, t, playSound, showNotification,
    windowTransparency, setWindowTransparency, animationSpeed, setAnimationSpeed, systemSound, setSystemSound,
    isGirlyMode, setIsGirlyMode, fileSystem, setFileSystem,
    isXboxMode, setIsXboxMode, isTVMode, setIsTVMode, headphonesActive, setHeadphonesActive,
    setDeviceCallout, bringToFront, isTaskbarClosed, setIsTaskbarClosed,
    openWindow, closeWindow
  } = useContext(OSContext);

  const installWin9Apps = () => {
    const win9Apps = {
      'win8': { name: 'Windows 8 (MSR)', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Windows_8_logo_and_wordmark.svg/512px-Windows_8_logo_and_wordmark.svg.png', isDownloaded: true, desc: 'Windows 8 Simulator', iframeUrl: 'https://msradmin.github.io/windows8/desktop/desktop.html' },
      'smb3': { name: 'Mario 3', icon: 'https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/128/Retro%20Block%20-%20Question.png', isDownloaded: true, desc: 'Super Mario Bros 3', iframeUrl: 'https://archive.org/embed/smb-3_20250410' },
      'famidash': { name: 'FamiDash', icon: 'https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/128/Retro%20Block%20-%20Question.png', isDownloaded: true, desc: 'FamiDash', iframeUrl: 'https://archive.org/embed/famidash-v-1.2.1' },
      'smwdx': { name: 'Mario World DX', icon: 'https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/128/Retro%20Block%20-%20Question.png', isDownloaded: true, desc: 'Super Mario World DX', iframeUrl: 'https://archive.org/embed/msdos_Super_Mario_World_DX_2002' },
      'mspac': { name: 'Ms. Pac-Man', icon: 'https://files.softicons.com/download/game-icons/pac-man-icons-by-mcloving/png/128x128/Pac-Man.png', isDownloaded: true, desc: 'Ms. Pac-Man', iframeUrl: 'https://archive.org/embed/msdos_Ms._Pac-Man_1983' },
      'car': { name: 'Car & Driver', icon: 'https://win98icons.alexmeub.com/icons/png/game_freecell-0.png', isDownloaded: true, desc: 'Car & Driver', iframeUrl: 'https://archive.org/embed/msdos_Car__Driver_1992' },
      'win31': { name: 'Windows 3.1', icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png', isDownloaded: true, desc: 'Windows 3.1', iframeUrl: 'https://archive.org/embed/w-3_20231227' },
      'dospro': { name: 'DOS Pro', icon: 'https://win98icons.alexmeub.com/icons/png/msdos-0.png', isDownloaded: true, desc: 'DOS Pro', iframeUrl: 'https://archive.org/embed/idos_20190826' },
      'bart': { name: 'Bart DOS', icon: 'https://win98icons.alexmeub.com/icons/png/msdos-0.png', isDownloaded: true, desc: 'Bart DOS', iframeUrl: 'https://archive.org/embed/bart_dos' },
      'infinity': { name: 'Win Infinity', icon: 'https://win98icons.alexmeub.com/icons/png/computer_explorer-4.png', isDownloaded: true, desc: 'Win Infinity', iframeUrl: 'https://www.newgrounds.com/projects/games/649743/preview' },
      'broken': { name: 'Broken OS', icon: 'https://win98icons.alexmeub.com/icons/png/msg_error-0.png', isDownloaded: true, desc: 'Broken OS', iframeUrl: 'https://archive.org/embed/unstable_ass_shit' },
      'abmcd': { name: 'AB McDonald\'s', icon: 'https://files.softicons.com/download/iphone-icons/zosha-icon-pack-by-craig-philips/png/60x61/AngryBirds.png', isDownloaded: true, desc: 'Angry Birds McDonald\'s', iframeUrl: 'https://archive.org/embed/angry-birds-mcdonalds_202403' },
      'abvsz': { name: 'AB vs Zombies', icon: 'https://files.softicons.com/download/iphone-icons/zosha-icon-pack-by-craig-philips/png/60x61/AngryBirds.png', isDownloaded: true, desc: 'Angry Birds vs Zombies', iframeUrl: 'https://archive.org/embed/angry-birds-vs-zombies' },
      'abcrazy': { name: 'AB Go Crazy', icon: 'https://files.softicons.com/download/iphone-icons/zosha-icon-pack-by-craig-philips/png/60x61/AngryBirds.png', isDownloaded: true, desc: 'Angry Birds Go Crazy', iframeUrl: 'https://archive.org/embed/angry-birds-go-crazy' },
      'cannon': { name: 'Cannon Bird', icon: 'https://files.softicons.com/download/iphone-icons/zosha-icon-pack-by-craig-philips/png/60x61/AngryBirds.png', isDownloaded: true, desc: 'Cannon Bird', iframeUrl: 'https://archive.org/embed/cannon-bird-3' },
      'scratch': { name: 'Scratch Game', icon: 'https://win98icons.alexmeub.com/icons/png/game_freecell-0.png', isDownloaded: true, desc: 'Scratch Game', iframeUrl: 'https://scratch.mit.edu/projects/1125055367/embed' },
      'iceage': { name: 'Ice Age DVD', icon: 'https://win98icons.alexmeub.com/icons/png/cd_audio_cd_a-4.png', isDownloaded: true, desc: 'Ice Age DVD', iframeUrl: 'https://archive.org/embed/ice-age-2002-dvd-opening-disc-1-60fps' }
    };

    setApps((prev: any) => ({ ...prev, ...win9Apps }));

    const newFs = JSON.parse(JSON.stringify(fileSystem));
    const desktopFolder = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'].contents;
    
    Object.entries(win9Apps).forEach(([id, app]) => {
      desktopFolder[`${app.name}.exe`] = { type: 'file', icon: app.icon, app: id };
    });
    
    setFileSystem(newFs);
    alert("All Windows 9 apps have been installed to your Desktop!");
  };

  const [installProgress, setInstallProgress] = useState<number | null>(null);

  const install167Apps = () => {
    setInstallProgress(0);
    const newApps: Record<string, any> = {};
    const appNames = [
      "Netflix", "Spotify", "Discord", "Twitter", "Facebook", "Instagram", "TikTok", "Reddit", "Twitch", "WhatsApp",
      "Telegram", "Zoom", "Slack", "VS Code", "GitHub", "StackOverflow", "Wikipedia", "Amazon", "eBay", "PayPal",
      "Maps", "Calculator Pro", "Camera", "Clock", "Contacts", "Messages", "Phone", "App Store", "iTunes", "GarageBand",
      "iMovie", "Pages", "Numbers", "Keynote", "Safari", "Firefox", "Edge", "Opera", "Brave", "Vivaldi",
      "Tor", "Minecraft", "Roblox Studio", "Fortnite", "CS:GO", "Valorant", "League of Legends", "Dota 2", "Overwatch", "Apex Legends",
      "PUBG", "GTA V", "Cyberpunk 2077", "Witcher 3", "RDR2", "Skyrim SE", "Fallout 4", "Doom", "Halo", "Portal",
      "Half-Life", "Team Fortress 2", "Left 4 Dead 2", "Garry's Mod", "Terraria", "Stardew Valley", "Among Us", "Fall Guys", "Rocket League", "FIFA",
      "NBA 2K", "Madden", "WWE 2K", "UFC", "F1", "Forza", "Gran Turismo", "Need for Speed", "Mario Kart", "Smash Bros",
      "Zelda", "Pokemon", "Animal Crossing", "Metroid", "Kirby", "Donkey Kong", "Sonic", "Pac-Man", "Tetris", "Space Invaders",
      "Galaga", "Asteroids", "Pong", "Breakout", "Centipede", "Frogger", "Dig Dug", "Q*bert", "Joust", "Defender",
      "Robotron", "Missile Command", "Tempest", "Battlezone", "Lunar Lander", "Red Baron", "Star Wars", "Indiana Jones", "E.T.", "Pitfall",
      "River Raid", "Kaboom", "Ms. Pac-Man", "Mario Bros.", "Super Mario Bros.", "Super Mario World", "Super Mario 64", "Super Mario Galaxy", "Super Mario Odyssey", "Mario Kart 8",
      "Super Smash Bros. Ultimate", "Ocarina of Time", "Breath of the Wild", "Tears of the Kingdom", "Super Metroid", "Metroid Prime", "Pokemon Red", "Pokemon Gold", "Pokemon Emerald", "Pokemon Platinum",
      "Pokemon Black", "Pokemon X", "Pokemon Sun", "Pokemon Sword", "Pokemon Scarlet", "Final Fantasy VII", "Final Fantasy X", "Final Fantasy XIV", "World of Warcraft", "Diablo II",
      "Diablo III", "Diablo IV", "StarCraft", "StarCraft II", "Warcraft III", "Hearthstone", "Magic The Gathering", "Yu-Gi-Oh!", "Genshin Impact", "Honkai Star Rail",
      "Candy Crush", "Clash of Clans", "Clash Royale", "Brawl Stars", "Angry Birds 2", "Plants vs Zombies", "Cut the Rope", "Fruit Ninja", "Temple Run", "Subway Surfers",
      "Flappy Bird 2", "2048", "Wordle", "Sudoku", "Chess", "Solitaire", "Minesweeper", "Pinball", "Snake", "Tinder",
      "Bumble", "Hinge", "Uber", "Lyft", "DoorDash", "Uber Eats", "Grubhub", "Postmates", "Instacart", "Airbnb",
      "Booking.com", "Expedia", "TripAdvisor", "Yelp", "Zillow", "Duolingo", "Rosetta Stone", "Babbel", "Coursera", "Udemy",
      "Khan Academy", "Quizlet", "Notion", "Evernote", "Trello", "Asana", "Jira", "Confluence", "Figma", "Adobe XD"
    ];

    const getIcon = (name: string) => {
      const lower = name.toLowerCase();
      const domainMap: Record<string, string> = {
        'netflix': 'netflix.com',
        'spotify': 'spotify.com',
        'discord': 'discord.com',
        'twitter': 'twitter.com',
        'facebook': 'facebook.com',
        'instagram': 'instagram.com',
        'tiktok': 'tiktok.com',
        'reddit': 'reddit.com',
        'twitch': 'twitch.tv',
        'whatsapp': 'whatsapp.com',
        'telegram': 'telegram.org',
        'zoom': 'zoom.us',
        'slack': 'slack.com',
        'vs code': 'visualstudio.com',
        'github': 'github.com',
        'stackoverflow': 'stackoverflow.com',
        'wikipedia': 'wikipedia.org',
        'amazon': 'amazon.com',
        'ebay': 'ebay.com',
        'paypal': 'paypal.com',
        'google': 'google.com',
        'bing': 'bing.com',
        'apple': 'apple.com',
        'microsoft': 'microsoft.com',
        'youtube': 'youtube.com',
        'chrome': 'google.com',
        'firefox': 'mozilla.org',
        'safari': 'apple.com',
        'edge': 'microsoft.com',
        'opera': 'opera.com',
        'brave': 'brave.com',
        'vivaldi': 'vivaldi.com',
        'tor': 'torproject.org',
        'roblox': 'roblox.com',
        'fortnite': 'epicgames.com',
        'minecraft': 'minecraft.net',
        'league of legends': 'leagueoflegends.com',
        'dota 2': 'dota2.com',
        'overwatch': 'overwatch.blizzard.com',
        'apex legends': 'ea.com',
        'pubg': 'pubg.com',
        'gta v': 'rockstargames.com',
        'cyberpunk 2077': 'cyberpunk.net',
        'witcher 3': 'thewitcher.com',
        'rdr2': 'rockstargames.com',
        'skyrim': 'bethesda.net',
        'fallout': 'bethesda.net',
        'doom': 'bethesda.net',
        'halo': 'halowaypoint.com',
        'portal': 'valvesoftware.com',
        'half-life': 'valvesoftware.com',
        'team fortress 2': 'teamfortress.com',
        'left 4 dead 2': 'valvesoftware.com',
        'garry\'s mod': 'gmod.facepunch.com',
        'terraria': 'terraria.org',
        'stardew valley': 'stardewvalley.net',
        'among us': 'innersloth.com',
        'fall guys': 'fallguys.com',
        'rocket league': 'rocketleague.com',
        'fifa': 'ea.com',
        'nba 2k': '2k.com',
        'madden': 'ea.com',
        'wwe 2k': '2k.com',
        'ufc': 'ea.com',
        'f1': 'ea.com',
        'forza': 'xbox.com',
        'gran turismo': 'playstation.com',
        'need for speed': 'ea.com',
        'mario kart': 'nintendo.com',
        'smash bros': 'nintendo.com',
        'zelda': 'nintendo.com',
        'pokemon': 'pokemon.com',
        'animal crossing': 'nintendo.com',
        'metroid': 'nintendo.com',
        'kirby': 'nintendo.com',
        'donkey kong': 'nintendo.com',
        'sonic': 'sega.com',
        'pac-man': 'bandainamcoent.com',
        'tetris': 'tetris.com',
        'genshin impact': 'hoyoverse.com',
        'honkai star rail': 'hoyoverse.com',
        'notion': 'notion.so',
        'evernote': 'evernote.com',
        'trello': 'trello.com',
        'asana': 'asana.com',
        'jira': 'atlassian.com',
        'confluence': 'atlassian.com',
        'figma': 'figma.com',
        'adobe xd': 'adobe.com',
        'photoshop': 'adobe.com',
        'duolingo': 'duolingo.com',
        'coursera': 'coursera.org',
        'udemy': 'udemy.com',
        'khan academy': 'khanacademy.org',
        'quizlet': 'quizlet.com',
        'uber': 'uber.com',
        'lyft': 'lyft.com',
        'airbnb': 'airbnb.com',
        'yelp': 'yelp.com',
        'zillow': 'zillow.com',
        'tinder': 'tinder.com',
        'bumble': 'bumble.com',
        'hinge': 'hinge.co',
        'booking.com': 'booking.com',
        'expedia': 'expedia.com',
        'tripadvisor': 'tripadvisor.com',
        'instacart': 'instacart.com',
        'doordash': 'doordash.com',
        'ubereats': 'ubereats.com',
        'grubhub': 'grubhub.com',
        'postmates': 'postmates.com'
      };

      for (const [key, domain] of Object.entries(domainMap)) {
        if (lower.includes(key)) return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      }

      // Special cases for games with specific icons
      if (lower.includes('mario')) return 'https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/128/Retro%20Block%20-%20Question.png';
      if (lower.includes('pokemon')) return 'https://files.softicons.com/download/game-icons/pokemon-icons-by-f-styler/png/128x128/Pokeball.png';
      if (lower.includes('pac-man')) return 'https://files.softicons.com/download/game-icons/pac-man-icons-by-mcloving/png/128x128/Pac-Man.png';
      
      return `https://picsum.photos/seed/${name.replace(/\s/g, '')}/128/128`;
    };

    while (appNames.length < 167) {
      appNames.push(`Generic App ${appNames.length + 1}`);
    }
    const finalAppNames = appNames.slice(0, 167);

    const newFs = JSON.parse(JSON.stringify(fileSystem));
    const desktopFolder = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'].contents;

    let current = 0;
    const total = finalAppNames.length;
    
    const interval = setInterval(() => {
      const name = finalAppNames[current];
      const id = `extra_app_${current}`;
      
      newApps[id] = {
        name: name,
        icon: getIcon(name),
        isDownloaded: true,
        isSimulated: true,
        description: `Experience ${name} right here in ${t('os_name')}!`,
        iframeUrl: `https://www.bing.com/search?q=${encodeURIComponent(name)}`
      };
      desktopFolder[`${name}.exe`] = { type: 'file', icon: newApps[id].icon, app: id };
      
      current++;
      setInstallProgress(Math.round((current / total) * 100));
      
      if (current >= total) {
        clearInterval(interval);
        setApps((prev: any) => ({ ...prev, ...newApps }));
        setFileSystem(newFs);
        setInstallProgress(null);
        playSound('notification');
        alert("167 MORE APPS HAVE BEEN INSTALLY FUCKED INTO YOUR DESKTOP!");
      }
    }, 10);
  };

  const [currentSettingsView, setCurrentSettingsView] = useState('main');
  const [settingsSearch, setSettingsSearch] = useState('');

  const renderPersonalisationView = () => (
    <div className="flex flex-col gap-4 h-full overflow-auto p-4 bg-white/50 backdrop-blur-sm rounded-lg animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-4 mb-2 sticky top-0 bg-white/80 backdrop-blur pb-2 z-10 border-b border-gray-200">
        <button onClick={() => setCurrentSettingsView('main')} className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-xl transition-colors">
          ←
        </button>
        <span className="font-bold text-gray-800 text-lg">Personalisation</span>
      </div>
      <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
        <h3 className="font-bold mb-3 text-blue-600 border-b pb-2">1-Click Installers</h3>
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-all font-bold shadow-md w-full mb-2"
          onClick={installWin9Apps}
        >
          Install All Windows 9 Apps
        </button>
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all font-bold shadow-md w-full"
          onClick={install167Apps}
          disabled={installProgress !== null}
        >
          {installProgress !== null ? `INSTALLING... ${installProgress}%` : "Install 167 MORE APPS"}
        </button>
        {installProgress !== null && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-green-600 h-2.5 rounded-full transition-all duration-75" style={{ width: `${installProgress}%` }}></div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
        <h3 className="font-bold mb-3 text-blue-600 border-b pb-2">{t('userName')} & {t('profilePic')}</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('userName')}</label>
            <input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('profilePic')}</label>
            <input type="text" value={userPfp} onChange={e => setUserPfp(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{t('darkMode')}</label>
          <button 
            className={`px-4 py-2 rounded w-full transition-all ${isDarkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? t('enabled') : t('disabled')}
          </button>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{t('retroMode')}</label>
          <button 
            className={`px-4 py-2 rounded w-full transition-all ${isRetroMode ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => setIsRetroMode(!isRetroMode)}
          >
            {isRetroMode ? t('enabled') : t('disabled')}
          </button>
        </div>
        <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Girly Mode 🎀</label>
          <button 
            className={`px-4 py-2 rounded w-full transition-all ${isGirlyMode ? 'bg-pink-500 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => {
              const newMode = !isGirlyMode;
              setIsGirlyMode(newMode);
              if (newMode) {
                setWallpaper('https://img.freepik.com/free-vector/flat-design-paw-prints-background_23-2151163105.jpg?semt=ais_hybrid&w=740&q=80');
                setLanguage('Girly');
              } else {
                setWallpaper('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920');
                setLanguage('English');
              }
            }}
          >
            {isGirlyMode ? t('enabled') : t('disabled')}
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
        <h3 className="font-bold mb-3 text-blue-600 border-b pb-2">{t('language')} & {t('pcMode')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('language')}</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="English">English</option>
              <option value="Piraty lan'gage M' Cap'an">Piraty lan'gage M' Cap'an</option>
              <option value="Bri'ish">Bri'ish</option>
              <option value="Wee Wee France">Wee Wee France</option>
              <option value="EatALee">EatALee</option>
              <option value="Portugal">Portugal</option>
              <option value="googoo gaga">googoo gaga</option>
              <option value="Arabic">Arabic</option>
              <option value="Parody Arabic">Parody Arabic</option>
              <option value="Chinese">Chinese</option>
              <option value="Girly">Girly 💅</option>
              <option value="FUCKY LANGUAGE">FUCKY LANGUAGE 🤬</option>
              <option value="Broken code">Broken code</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('pcMode')}</label>
            <select value={pcMode} onChange={e => setPcMode(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="default">Default</option>
              <option value="terminal">Terminal</option>
              <option value="no css">No CSS</option>
              <option value="og wallpaper">OG Wallpaper</option>
              <option value="liquid glass">Liquid Glass</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
        <h3 className="font-bold mb-3 text-blue-600 border-b pb-2">System Effects</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="flex justify-between text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              <span>{t('windowTransparency')}</span>
              <span>{Math.round(windowTransparency * 100)}%</span>
            </label>
            <input type="range" min="0.1" max="1" step="0.05" value={windowTransparency} onChange={e => setWindowTransparency(parseFloat(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="flex justify-between text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              <span>{t('animationSpeed')}</span>
              <span>{animationSpeed}s</span>
            </label>
            <input type="range" min="0" max="1" step="0.05" value={animationSpeed} onChange={e => setAnimationSpeed(parseFloat(e.target.value))} className="w-full accent-blue-600" />
          </div>
          <div>
            <label className="flex justify-between text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">
              <span>{t('systemSound')}</span>
              <span>{Math.round(systemSound * 100)}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05" 
              value={systemSound} 
              onChange={e => {
                const val = parseFloat(e.target.value);
                setSystemSound(val);
                // Play a small click sound to preview volume
                const audio = new Audio('https://actions.google.com/sounds/v1/ui/button_click.ogg');
                audio.volume = val;
                audio.play().catch(() => {});
              }} 
              className="w-full accent-blue-600" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
        <h3 className="font-bold mb-3 text-blue-600 border-b pb-2">Taskbar & Interface</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
             <label className="flex items-center gap-2 cursor-pointer">
               <input 
                 type="checkbox" 
                 checked={isTaskbarClosed} 
                 onChange={(e) => setIsTaskbarClosed(e.target.checked)} 
                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
               />
               <span className="text-sm font-medium text-gray-700">Charms Bar Mode (Disable Desktop Taskbar)</span>
             </label>
             <p className="text-xs text-gray-400 mt-1">If enabled, the main taskbar will be hidden and replaced with the forever Charms Bar overlay on the right.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('taskbarPosition')}</label>
            <select value={taskbarPosition} onChange={e => setTaskbarPosition(e.target.value as any)} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('mouseCursor')}</label>
            <select value={cursorStyle} onChange={e => setCursorStyle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
              <option value="default">Default</option>
              <option value="crosshair">Crosshair</option>
              <option value="pointer">Pointer</option>
              <option value="wait">Wait</option>
              <option value="text">Text</option>
              <option value="help">Help</option>
              <option value="url('https://files.softicons.com/download/system-icons/windows-8-metro-icons-by-dakirby309/png/32x32/Folders%20&%20OS/Mouse.png'), auto">Original PC Mouse</option>
            </select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('taskbarColor')}</label>
            <input type="color" value={taskbarColor.startsWith('#') ? taskbarColor : '#ffffff'} onChange={e => setTaskbarColor(e.target.value)} className="w-full h-10 border border-gray-300 rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('startButton')}</label>
            <button 
              className={`px-4 py-2 rounded w-full transition-all ${showStartButton ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
              onClick={() => setShowStartButton(!showStartButton)}
            >
              {showStartButton ? t('visible') : t('hidden')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow-sm border border-gray-100">
        <label className="block text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">{t('wallpaper')}</label>
        <div className="flex gap-2 flex-wrap">
          {[
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1920',
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1920',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1920',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1920',
            'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1920'
          ].map((url, i) => (
            <img 
              key={i} 
              src={url} 
              alt="wallpaper" 
              className={`w-20 h-12 object-cover rounded cursor-pointer border-2 transition-all ${wallpaper === url ? 'border-blue-500 scale-110 shadow-md' : 'border-transparent hover:border-gray-300'}`} 
              onClick={() => setWallpaper(url)} 
            />
          ))}
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded shadow-sm border border-red-200 mt-4">
        <h3 className="font-bold mb-3 text-red-700 border-b border-red-200 pb-2">Devices & Ports</h3>
        <p className="text-xs text-red-600 mb-4 font-medium leading-tight">Simulate plugging devices into your computer ports. Be warned, the OS will scream.</p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            className={`px-3 py-2 text-xs font-bold rounded text-white ${isXboxMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-900'} transition-all`}
            onClick={() => {
              if (!isXboxMode) {
                setDeviceCallout("DEVICE CONNECTED: CONSOLE");
                setIsXboxMode(true);
                setIsTVMode(false);
                playSound('startup');
              } else {
                setIsXboxMode(false);
              }
            }}
          >
            🎮 {isXboxMode ? "Unplug Console" : "Plug in Console"}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-bold rounded text-white ${headphonesActive ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-800 hover:bg-gray-900'} transition-all`}
            onClick={() => {
              if (!headphonesActive) {
                setDeviceCallout("DEVICE CONNECTED: HEADPHONES");
                setHeadphonesActive(true);
                playSound('startup');
              } else {
                setHeadphonesActive(false);
              }
            }}
          >
            🎧 {headphonesActive ? "Unplug Headphones" : "Plug in Headphones"}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-bold rounded text-white bg-gray-800 hover:bg-gray-900 transition-all`}
            onClick={() => {
              setDeviceCallout("DEVICE CONNECTED: USB STORAGE");
              playSound('startup');
              // We'll mimic plugging in a USB by navigating to PC and opening it.
              setTimeout(() => {
                const clickEvent = new MouseEvent('dblclick', { bubbles: true });
                const icon = document.querySelector('[alt="PC"]');
                if (icon) icon.dispatchEvent(clickEvent);
              }, 1000);
            }}
          >
            💾 Plug in USB Drive
          </button>
          <button 
            className={`px-3 py-2 text-xs font-bold rounded text-white ${isTVMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-800 hover:bg-gray-900'} transition-all`}
            onClick={() => {
              if (!isTVMode) {
                setDeviceCallout("DEVICE CONNECTED: TV REMOTE");
                setIsTVMode(true);
                setIsXboxMode(false);
                playSound('startup');
              } else {
                setIsTVMode(false);
              }
            }}
          >
            📺 {isTVMode ? "Disconnect Remote" : "Connect Remote"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderBluetoothView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">
          ←
        </button>
        <span className="font-semibold text-2xl">Bluetooth & other devices</span>
      </div>
      <div className="text-sm text-gray-400 mb-6">"Blootooth the thing... you know what i mean"</div>
      
      <div className="flex flex-col gap-4">
        <div className="bg-gray-800/80 p-4 rounded flex items-center justify-between shadow-lg ring-1 ring-white/10 cursor-pointer hover:bg-gray-700/80 transition-colors">
          <div className="flex items-center gap-4">
            <span className="text-blue-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </span>
            <div>
              <div className="font-bold text-lg text-blue-400">Add Bluetooth or other device</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4 space-y-4">
          <div className="text-xl font-medium tracking-tight">Mouse, keyboard, & pen</div>
          
          <div className="bg-gray-800/50 p-4 rounded flex items-center relative overflow-hidden group cursor-pointer hover:bg-gray-800 transition-colors">
            <div className="flex flex-col gap-1 w-full relative z-10">
              <div className="font-medium text-white flex justify-between">
                Dell Premium Mouse 
                <span className="text-xs text-gray-500 italic">Connected</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded flex items-center relative overflow-hidden group cursor-pointer hover:bg-gray-800 transition-colors">
            <div className="flex flex-col gap-1 w-full relative z-10">
              <div className="font-medium text-white flex justify-between">
                HP K2500 Wireless Keyboard
                <span className="text-xs text-gray-500 italic">Not connected</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 pt-8 pb-4 px-4 rounded flex items-center relative overflow-hidden animate-pulse border border-blue-500/30">
            <div className="flex flex-col items-center justify-center gap-2 w-full text-center">
              <div className="text-blue-400 mb-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10 animate-spin"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
              </div>
              <div className="font-bold text-blue-400">Scanning for new Blootooth things...</div>
              <div className="text-xs text-gray-400">Wait, is it spelled like that?</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">
          ←
        </button>
        <span className="font-semibold text-2xl">System</span>
      </div>
      
      <div className="flex h-full">
        <div className="w-64 border-r border-white/10 flex flex-col gap-1 pr-4">
           {['Display', 'Sound', 'Notifications & actions', 'Focus assist', 'Power & sleep', 'Battery', 'Storage', 'Tablet mode', 'Multitasking', 'Projecting to this PC', 'Shared experiences', 'Clipboard', 'Remote Desktop', 'About'].map(t => (
             <div key={t} className={`px-4 py-2 text-sm tracking-wide rounded cursor-pointer ${t === 'About' ? 'bg-blue-600 text-white font-bold border-l-4 border-white' : 'text-gray-400 hover:bg-white/10'}`}>
               {t}
             </div>
           ))}
        </div>
        <div className="pl-6 flex-1 flex flex-col items-center justify-center text-center">
             <div className="mb-6 shadow-red-500 shadow-2xl rounded-full bg-red-600 text-white p-6 animate-ping ring-8 ring-red-500/30">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
             </div>
             <h1 className="text-4xl font-black text-red-500 tracking-tighter mb-4 uppercase">CRITICAL SYSTEM MELTDOWN</h1>
             <p className="text-gray-300 text-lg max-w-md">
               "in System, There is.... Well..." <br/><br/>
               Well, unfortunately it turns out the System does not exist. We lost it. It fell down a drain in the parking lot. You have NO system. You're running on hopes and dreams right now.
             </p>
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-4">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Mobile devices</span>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg mx-auto">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-32 h-32 text-blue-400 mb-6"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
         <h2 className="text-3xl font-bold mb-4">Link your phone</h2>
         <p className="text-gray-400 mb-8">We have already silently established a neural link to your mobile device using 5G micro-waves. No further action is required. Your texts belong to us now.</p>
         <div className="bg-white p-4 rounded-lg shadow-2xl flex items-center justify-center">
            <div className="w-48 h-48 bg-black grid grid-cols-6 grid-rows-6 gap-1 p-2">
               {Array.from({length: 36}).map((_, i) => <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>)}
            </div>
         </div>
      </div>
    </div>
  );

  const renderNetworkView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Network & Internet</span>
      </div>
      <div className="flex flex-col max-w-2xl">
         <div className="flex items-center gap-6 mb-8 p-4 bg-gray-800/40 rounded-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16 text-green-400"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">FBI_SURVEILLANCE_VAN_4</span>
              <span className="text-green-400">Connected, secured</span>
            </div>
         </div>
         <h3 className="font-medium text-lg mb-4 text-blue-400">Properties</h3>
         <div className="space-y-4 text-sm bg-gray-900/50 p-6 rounded border border-gray-800">
           <div className="flex justify-between"><span className="text-gray-400">Protocol:</span> <span>Wi-Fi 9 (802.11z)</span></div>
           <div className="flex justify-between"><span className="text-gray-400">Security type:</span> <span>None. Open season.</span></div>
           <div className="flex justify-between"><span className="text-gray-400">Network band:</span> <span>999 GHz</span></div>
           <div className="flex justify-between"><span className="text-gray-400">IPv4 address:</span> <span>192.168.1.???</span></div>
         </div>
      </div>
    </div>
  );

  const renderAppsView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Apps & features</span>
      </div>
      <div className="space-y-2 overflow-y-auto pr-4 pb-4">
         {['Candy Crush Saga Ultra', 'Internet Explorer Toolbar', 'BonziBuddy 2026', 'McAfee Antivirus Threat Generator'].map(app => (
           <div key={app} className="flex items-center justify-between p-4 bg-gray-800/40 rounded hover:bg-gray-800 transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-600 rounded shadow-inner flex items-center justify-center text-xl">📦</div>
                 <div className="flex flex-col">
                   <span className="font-semibold">{app}</span>
                   <span className="text-xs text-gray-400">14.2 GB • Microsoft Corporation</span>
                 </div>
              </div>
              <button onClick={() => { playSound('error'); alert("Access Denied. This app is too critical for your system stability to be removed."); }} className="px-4 py-1.5 bg-gray-700 hover:bg-red-600 transition-colors rounded text-sm">Uninstall</button>
           </div>
         ))}
      </div>
    </div>
  );

  const renderAccountsView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Your info</span>
      </div>
      <div className="flex flex-col max-w-lg">
         <div className="flex items-center gap-6 mb-8">
           <img src={userPfp || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-700" />
           <div className="flex flex-col">
              <h2 className="text-3xl font-bold">{userName || "doble300@outlook.com"}</h2>
              <span className="text-gray-400">Administrator</span>
              <span className="text-blue-400 cursor-pointer hover:underline mt-2 text-sm">Manage my Microsoft account</span>
           </div>
         </div>
         <button onClick={() => setUserName("Local_User_" + Math.floor(Math.random() * 9999))} className="text-left text-blue-400 hover:text-blue-300 w-max text-lg mb-8">Sign in with a local account instead</button>
         <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded self-start border border-gray-600">Create your picture</button>
      </div>
    </div>
  );

  const renderTimeView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Date & time</span>
      </div>
      <div className="flex flex-col gap-6 max-w-lg">
        <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-sm">Current date and time</span>
          <span className="text-4xl font-light text-white font-mono tracking-wider">{new Date().toLocaleTimeString()}</span>
        </div>
        <button onClick={() => alert("Time synchronized with Mars rover. You are now 42 minutes in the future.")} className="bg-gray-800 border border-gray-600 px-4 py-2 rounded self-start mt-4 hover:bg-gray-700">Sync time with Mars</button>
      </div>
    </div>
  );

  const renderGamingView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Gaming</span>
      </div>
      <div className="flex flex-col gap-6 max-w-lg">
        <div className="bg-green-900/40 border border-green-500/50 p-4 rounded flex items-center gap-4">
           <span className="text-4xl">🎮</span>
           <div className="flex flex-col">
             <span className="font-bold text-green-400">Game Mode is ON</span>
             <span className="text-sm text-green-200">Automatically overclocking GPU to 9000°C for maximum frames.</span>
           </div>
        </div>
        <button onClick={() => {
            setApps(prev => ({
              ...prev,
              nes: { name: 'NES Emulator', icon: 'https://win98icons.alexmeub.com/icons/png/game_freecell-0.png', isDownloaded: true, desc: 'NES', iframeUrl: 'https://archive.org/embed/smb-3_20250410' }
            }));
            openWindow('nes');
        }} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded text-lg font-semibold shadow-lg transition-colors w-max">Play Random NES Game</button>
      </div>
    </div>
  );

  const renderEaseView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Ease of Access</span>
      </div>
      <div className="flex flex-col gap-6 max-w-lg">
        <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded">
          <div className="flex flex-col">
            <span className="font-medium">Make everything huge</span>
            <span className="text-sm text-gray-400">Increases scale to absolute maximum</span>
          </div>
          <button onClick={() => { setAnimationSpeed('slow'); setWindowTransparency(false); alert("Attempted to make things huge, but the screen ran out of pixels."); }} className="w-12 h-6 bg-gray-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full mx-1"></div></button>
        </div>
      </div>
    </div>
  );

  const renderSearchView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Search settings</span>
      </div>
      <div className="space-y-4 max-w-lg mt-4">
        <h3 className="font-medium text-lg text-white">Recent Search History (Public via Cortana)</h3>
        <ul className="list-disc pl-6 text-gray-400 space-y-2">
          <li>"how to download more ram"</li>
          <li>"why is my computer breathing"</li>
          <li>"delete system32 safe?"</li>
          <li>"free vbucks generator no virus"</li>
        </ul>
        <button onClick={() => alert("Yeah right, like we're gonna let you delete that.")} className="mt-6 px-4 py-2 bg-gray-800 hover:bg-red-900 border border-gray-700 text-white rounded">Delete History</button>
      </div>
    </div>
  );

  const renderPrivacyView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Privacy</span>
      </div>
      <div className="flex flex-col gap-6 max-w-lg">
        <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200">
           <h3 className="text-xl font-bold text-red-400 mb-2">Notice</h3>
           <p>You have no privacy. Location: YES. Camera: YES. Microphone: YES. We are selling your data to advertisers right now in real-time.</p>
        </div>
      </div>
    </div>
  );

  const renderUpdateView = () => (
    <div className="flex flex-col h-full bg-black text-white p-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentSettingsView('main')} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-2xl transition-colors">←</button>
        <span className="font-semibold text-2xl">Update & Security</span>
      </div>
      
      <div className="flex h-full">
        <div className="w-64 border-r border-white/10 flex flex-col gap-1 pr-4">
           {['Windows Update', 'Delivery Optimization', 'Windows Security', 'Backup', 'Troubleshoot', 'Recovery', 'Activation', 'Find my device'].map(t => (
             <div key={t} className={`px-4 py-2 text-sm tracking-wide rounded cursor-pointer ${t === 'Recovery' ? 'bg-blue-600 text-white font-bold border-l-4 border-white' : 'text-gray-400 hover:bg-white/10'}`}>
               {t}
             </div>
           ))}
        </div>
        <div className="pl-6 flex-1 flex flex-col items-start pt-4">
             <h2 className="text-3xl font-light mb-6">Recovery</h2>
             
             <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Reset this PC</h3>
                <p className="text-gray-400 text-sm mb-4">If your PC isn't running well, resetting it might help. This lets you choose to keep your personal files or remove them, and then reinstalls MS-DOS natively.</p>
                <button 
                  onClick={() => {
                    setPcMode('terminal');
                    setApps(prev => ({
                      ...prev,
                      msdos: { name: 'MS-DOS', icon: 'https://win98icons.alexmeub.com/icons/png/msdos-0.png', isDownloaded: true, desc: 'MS-DOS', iframeUrl: 'https://archive.org/embed/idos_20190826' }
                    }));
                    openWindow('msdos');
                    closeWindow('settings');
                  }} 
                  className="bg-gray-200 hover:bg-white text-black font-semibold px-6 py-2 border-2 border-transparent transition-colors"
                >
                  Get started
                </button>
             </div>
             
             <div className="mb-8">
                <h3 className="font-semibold text-lg mb-2">Advanced startup</h3>
                <p className="text-gray-400 text-sm mb-4">Start up from a device or disc (such as a USB drive or DVD), change your PC's firmware settings, change Windows startup settings, or restore Windows from a system image.</p>
                <button onClick={() => alert("No boot devices found. Your hard drive is just a suggestion.")} className="bg-gray-200 hover:bg-white text-black font-semibold px-6 py-2 border-2 border-transparent transition-colors">Restart now</button>
             </div>
        </div>
      </div>
    </div>
  );

  const renderWindows10MainView = () => {
    const categories = [
      { id: 'system', name: 'System', desc: 'Display, sound, notifications, power', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
      { id: 'devices', name: 'Devices', desc: 'Bluetooth, printers, mouse', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><circle cx="6" cy="12" r="1.5" fill="currentColor"/><circle cx="11" cy="12" r="1.5" fill="currentColor"/><circle cx="16" cy="12" r="1.5" fill="currentColor"/></svg> },
      { id: 'mobile', name: 'Mobile devices', desc: 'Link your Android, iPhone', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
      { id: 'network', name: 'Network & Internet', desc: 'WiFi, flight mode, VPN', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> },
      { id: 'personalisation', name: 'Personalisation', desc: '1-Click installers, Taskbar and interface.. etc', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
      { id: 'apps', name: 'Apps', desc: 'Uninstall, defaults', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
      { id: 'accounts', name: 'Accounts', desc: 'Your accounts, email, sync, work, family', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
      { id: 'time', name: 'Time & Language', desc: 'Speech, region, date', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
      { id: 'gaming', name: 'Gaming', desc: 'Game Bar, captures, Game Mode', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M21 11.51V10a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1.51M21 12H3"/><path d="M7 16V12"/><path d="M5 14h4"/><circle cx="17" cy="14" r="1" fill="currentColor"/><circle cx="19" cy="14" r="1" fill="currentColor"/></svg> },
      { id: 'ease', name: 'Ease of Access', desc: 'Narrator, magnifier, high contrast', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="12" cy="12" r="10" strokeDasharray="4 4"/><circle cx="12" cy="12" r="5"/></svg> },
      { id: 'search', name: 'Search', desc: 'Find my files, permissions', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
      { id: 'privacy', name: 'Privacy', desc: 'Location, camera, microphone', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
      { id: 'update', name: 'Update & Security', desc: 'Windows Update, recovery, backup', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg> },
    ];

    return (
      <div className="flex flex-col w-full h-full bg-black text-white p-8 font-sans animate-in fade-in">
        {/* Header Section */}
        <div className="flex items-start justify-between w-full max-w-5xl mx-auto mb-10 pb-6 border-b border-gray-800">
           <div className="flex items-center gap-6">
             <img src={userPfp || "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-transparent hover:border-gray-500 cursor-pointer transition-colors shadow-2xl" />
             <div className="flex flex-col">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-1">{userName || "doble300@outlook.com"}</h1>
                <span className="text-gray-400 text-sm mb-1">{userName || "doble300@outlook.com"}</span>
                <span className="text-blue-400 text-sm hover:underline cursor-pointer">My Microsoft account</span>
             </div>
           </div>
           
           <div className="flex gap-10 pt-2">
              <div className="flex items-center gap-4 cursor-pointer group">
                  <div className="text-gray-300 opacity-80 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>
                  </div>
                  <div className="flex flex-col">
                     <span className="font-semibold text-white">OneDrive</span>
                     <span className="text-xs text-gray-400 group-hover:text-gray-300">Manage</span>
                  </div>
              </div>
              <div className="flex items-center gap-4 cursor-pointer group">
                  <div className="text-gray-300 opacity-80 group-hover:opacity-100 transition-opacity relative">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>
                    <div className="absolute top-0 -right-1 w-3 h-3 bg-red-500 rounded-full border border-black animate-pulse"></div>
                  </div>
                  <div className="flex flex-col">
                     <span className="font-semibold text-white">Windows Update</span>
                     <span className="text-xs text-gray-400 group-hover:text-gray-300">Attention needed</span>
                  </div>
              </div>
           </div>
        </div>

        {/* Setting Search */}
        <div className="w-full max-w-md mx-auto mb-12 relative flex">
          <input 
            type="text" 
            placeholder="Find a setting" 
            className="w-full bg-white text-black px-4 py-2 focus:outline-none border-b-2 border-transparent outline-none focus:border-blue-500" 
            value={settingsSearch}
            onChange={(e) => setSettingsSearch(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 max-w-6xl mx-auto w-full px-4 content-start">
          {categories.map((cat) => (
             <div 
               key={cat.id} 
               onClick={() => {
                 if (cat.id === 'personalisation') setCurrentSettingsView('personalisation');
                 else if (cat.id === 'devices') setCurrentSettingsView('bluetooth');
                 else if (cat.id === 'system') setCurrentSettingsView('system');
                 else if (cat.id === 'mobile') setCurrentSettingsView('mobile');
                 else if (cat.id === 'network') setCurrentSettingsView('network');
                 else if (cat.id === 'apps') setCurrentSettingsView('apps');
                 else if (cat.id === 'accounts') setCurrentSettingsView('accounts');
                 else if (cat.id === 'time') setCurrentSettingsView('time');
                 else if (cat.id === 'gaming') setCurrentSettingsView('gaming');
                 else if (cat.id === 'ease') setCurrentSettingsView('ease');
                 else if (cat.id === 'search') setCurrentSettingsView('search');
                 else if (cat.id === 'privacy') setCurrentSettingsView('privacy');
                 else if (cat.id === 'update') setCurrentSettingsView('update');
               }}
               className="flex items-start gap-4 p-2 -m-2 cursor-pointer group rounded transition-all hover:bg-white/5 active:bg-white/10"
             >
                <div className="mt-1 text-teal-400 group-hover:text-teal-300 shrink-0 transition-colors flex items-center justify-center">
                  {cat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-base text-gray-100 group-hover:text-white transition-colors tracking-wide leading-tight mb-1">{cat.name}</span>
                  <span className="text-[13px] text-gray-400 group-hover:text-gray-300 transition-colors leading-snug pr-4">{cat.desc}</span>
                </div>
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {currentSettingsView === 'main' && renderWindows10MainView()}
      {currentSettingsView === 'personalisation' && renderPersonalisationView()}
      {currentSettingsView === 'bluetooth' && renderBluetoothView()}
      {currentSettingsView === 'system' && renderSystemView()}
      {currentSettingsView === 'mobile' && renderMobileView()}
      {currentSettingsView === 'network' && renderNetworkView()}
      {currentSettingsView === 'apps' && renderAppsView()}
      {currentSettingsView === 'accounts' && renderAccountsView()}
      {currentSettingsView === 'time' && renderTimeView()}
      {currentSettingsView === 'gaming' && renderGamingView()}
      {currentSettingsView === 'ease' && renderEaseView()}
      {currentSettingsView === 'search' && renderSearchView()}
      {currentSettingsView === 'privacy' && renderPrivacyView()}
      {currentSettingsView === 'update' && renderUpdateView()}
    </>
  );
};

const ThemeStoreApp = () => {
  const { unlockedThemes, setUnlockedThemes, activeCustomTheme, setActiveCustomTheme, playSound } = useContext(OSContext);

  const themes = [
    { id: 'glitch', name: 'Glitch PC', price: 'Free', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', desc: 'Break the matrix.' },
    { id: 'green_retro', name: 'Green Retro', price: 'Free', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kdf.png', desc: 'Old school terminal vibes.' },
    { id: 'gettyimages', name: 'Getty Images', price: 'Free', icon: 'https://media.gettyimages.com/id/1149232338/photo/watermark-placeholder.jpg', desc: 'Replace all icons with Getty Images.' },
    { id: 'rounded', name: 'Rounded', price: 'Free', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', desc: 'Everything is so perfectly round.' },
    { id: 'no_rounded', name: 'No Rounded', price: 'Free', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/terminal.png', desc: 'Sharp edges only. Blocky style.' },
    { id: 'poo', name: 'Poo Color', price: 'Free', icon: 'https://files.softicons.com/download/social-media-icons/free-social-media-icons-by-aha-soft/png/128x128/yahoo.png', desc: 'Brown, brown, brown.' },
    { id: 'baldi', name: 'All Baldis Basics', price: 'Free', icon: 'https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/b/ba/Baldi_transparent.png/revision/latest/scale-to-width/360?cb=20201010041443', desc: 'Welcome to Baldis Basics in Education and Learning!' }
  ];

  return (
    <div className="p-4 bg-gray-50 h-full overflow-y-auto font-sans text-gray-800">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-xl shadow-lg mb-6 text-white flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2">PC Themes Store</h2>
          <p className="text-purple-100 font-medium">Personalize your system with exclusive themes!</p>
        </div>
        <div className="text-6xl opacity-80">🎨</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map(theme => {
          const isUnlocked = unlockedThemes.includes(theme.id);
          const isActive = activeCustomTheme === theme.id;

          return (
            <div key={theme.id} className="bg-white border-2 border-gray-100 rounded-xl p-4 flex gap-4 transition-all hover:shadow-md hover:border-purple-200">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                <img src={theme.icon} alt={theme.name} className="w-10 h-10 object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg leading-tight text-gray-900">{theme.name}</h3>
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded shadow-sm">{theme.price}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">{theme.desc}</p>
                
                {isActive ? (
                  <button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg text-xs font-bold uppercase transition-colors"
                    onClick={() => {
                      playSound('click');
                      setActiveCustomTheme(null);
                    }}
                  >
                    Active - Click to Remove
                  </button>
                ) : isUnlocked ? (
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-bold uppercase transition-colors"
                    onClick={() => {
                      playSound('notification');
                      setActiveCustomTheme(theme.id);
                    }}
                  >
                    Apply Theme
                  </button>
                ) : (
                  <button 
                    className="w-full bg-gray-900 hover:bg-black text-white py-1.5 rounded-lg text-xs font-bold uppercase transition-colors flex justify-center items-center gap-1"
                    onClick={() => {
                      playSound('startup');
                      setUnlockedThemes([...unlockedThemes, theme.id]);
                      setActiveCustomTheme(theme.id);
                    }}
                  >
                    <span>Download</span> <span>↓</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MsPompUpdate = () => (
  <div className="p-4 bg-pink-50 h-full overflow-auto font-sans">
    <h1 className="text-2xl font-black text-pink-700 mb-6 tracking-tighter uppercase italic border-b-2 border-pink-200 pb-2">Ms. Pomp's Sweet Lessons <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full not-italic tracking-widest ml-1">v2.0</span></h1>
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 transform hover:scale-[1.02] transition-transform cursor-default">
        <h2 className="font-black text-pink-600 italic underline text-xl mb-3">Lesson 1: Digital Kindness</h2>
        <p className="text-gray-700 leading-relaxed font-medium">In this digital paradise, being sweet is our superpower, Gomer! Remember to use your digital voice for good! ✨</p>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 transform hover:scale-[1.02] transition-transform cursor-default">
        <h2 className="font-black text-pink-600 italic underline text-xl mb-3">Lesson 2: Desktop Harmony</h2>
        <p className="text-gray-700 leading-relaxed font-medium">A tidy workspace is a happy mind. Use the new explorer bar to sort your files by name or type! It's simply wonderful! 📂</p>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 transform hover:scale-[1.02] transition-transform cursor-default">
        <h2 className="font-black text-pink-600 italic underline text-xl mb-3">Lesson 3: Creative Spirits</h2>
        <p className="text-gray-700 leading-relaxed font-medium font-bold text-blue-500">The new App Maker tool lets you build your very own digital masterpieces! I can't wait to see what you create, deary! 🎨</p>
      </div>
    </div>
    <div className="text-center mt-12 mb-8 animate-bounce">
        <img src="https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/128x128/emotes/face-smile.png" className="w-20 h-20 mx-auto drop-shadow-xl" />
        <p className="text-pink-400 mt-4 font-black italic tracking-widest uppercase text-xs">I believe in you, sweetie!</p>
    </div>
  </div>
);

const AppMakerApp = () => {
  const [appName, setAppName] = useState('My Awesome App');
  const [appIcon, setAppIcon] = useState('https://win98icons.alexmeub.com/icons/png/application_shell-0.png');
  const [appDescription, setAppDescription] = useState('A cool app made with Beta OS.');
  const [appContent, setAppContent] = useState('<h1>Hello World!</h1><p>Edit me!</p>');
  const { setApps, showNotification, t } = useContext(OSContext);

  const createApp = () => {
    const appId = `custom_${Date.now()}`;
    setApps((prev: any) => ({
      ...prev,
      [appId]: {
        name: appName,
        icon: appIcon,
        isDownloaded: true,
        desc: appDescription,
        customContent: appContent
      }
    }));
    showNotification(`Successfully created ${appName}!`, appIcon);
    alert(`${appName} has been added to your Launchpad!`);
  };

  return (
    <div className="p-6 h-full bg-gray-50 overflow-y-auto text-black font-sans">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <header className="border-b pb-4">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-blue-600">App Maker <span className="text-xs bg-yellow-400 px-2 py-0.5 rounded text-black ml-2 font-bold not-italic tracking-normal">BETA</span></h2>
          <p className="text-xs text-gray-500 font-medium">Create your own persistent application for Beta OS.</p>
        </header>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">App Name</label>
              <input type="text" value={appName} onChange={e => setAppName(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Icon URL</label>
              <input type="text" value={appIcon} onChange={e => setAppIcon(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Short Description</label>
            <input type="text" value={appDescription} onChange={e => setAppDescription(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">HTML Content</label>
            <textarea value={appContent} onChange={e => setAppContent(e.target.value)} className="w-full border rounded-xl px-4 py-2 text-xs font-mono h-32 focus:ring-2 focus:ring-blue-400 outline-none transition-all" />
          </div>

          <button onClick={createApp} className="w-full bg-blue-600 hover:bg-black text-white font-black py-4 rounded-2xl transition-all shadow-lg active:scale-95 uppercase tracking-widest text-xs">Assemble Application</button>
        </section>

        <section className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
          <h3 className="text-xs font-black uppercase tracking-widest text-yellow-800 mb-2">Live Preview</h3>
          <div className="bg-white border rounded-xl p-4 min-h-[100px] text-sm" dangerouslySetInnerHTML={{ __html: appContent }}></div>
        </section>
      </div>
    </div>
  );
};

const CalculatorApp = () => {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);

  const handleNum = (n: string) => {
    setDisplay(prev => prev === '0' ? n : prev + n);
  };

  const handleOp = (o: string) => {
    setPrev(parseFloat(display));
    setOp(o);
    setDisplay('0');
  };

  const calculate = () => {
    if (prev === null || op === null) return;
    const current = parseFloat(display);
    let result = 0;
    if (op === '+') result = prev + current;
    if (op === '-') result = prev - current;
    if (op === '*') result = prev * current;
    if (op === '/') result = prev / current;
    setDisplay(result.toString());
    setPrev(null);
    setOp(null);
  };

  return (
    <div className="bg-[#f0f0f0] p-4 h-full flex flex-col gap-2 text-black">
      <div className="bg-white border p-2 text-right text-2xl font-mono h-12 flex items-center justify-end">{display}</div>
      <div className="grid grid-cols-4 gap-2 flex-grow">
        {['7', '8', '9', '/'].map(b => <button key={b} className="bg-white border hover:bg-gray-100 p-2" onClick={() => b === '/' ? handleOp('/') : handleNum(b)}>{b}</button>)}
        {['4', '5', '6', '*'].map(b => <button key={b} className="bg-white border hover:bg-gray-100 p-2" onClick={() => b === '*' ? handleOp('*') : handleNum(b)}>{b}</button>)}
        {['1', '2', '3', '-'].map(b => <button key={b} className="bg-white border hover:bg-gray-100 p-2" onClick={() => b === '-' ? handleOp('-') : handleNum(b)}>{b}</button>)}
        {['0', 'C', '=', '+'].map(b => <button key={b} className="bg-white border hover:bg-gray-100 p-2" onClick={() => b === '=' ? calculate() : b === 'C' ? setDisplay('0') : b === '+' ? handleOp('+') : handleNum(b)}>{b}</button>)}
      </div>
    </div>
  );
};

const CalendarApp = () => {
  const { t } = useContext(OSContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [events] = useState([
    { id: 1, date: '2026-04-10', title: 'Meeting with Darius', description: 'Discuss the new app features.' },
    { id: 2, date: '2026-04-15', title: 'Misses Pomp Class', description: `Learn about ${t('os_name')} architecture.` },
    { id: 3, date: '2026-04-20', title: 'Lunch with Gomer', description: 'Eat some virtual pizza.' },
    { id: 4, date: '2026-05-01', title: 'Project Deadline', description: 'Finish the productivity suite.' },
  ]);

  const date = new Date();
  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthName = date.toLocaleString('default', { month: 'long' });

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white p-4 h-full text-black flex flex-col">
      <div className="text-xl font-bold mb-4 text-center">{monthName} {date.getFullYear()}</div>
      
      {/* Search Bar */}
      <div className="mb-4 flex gap-2">
        <input 
          type="text" 
          placeholder="Search events..." 
          className="flex-grow p-2 border rounded text-sm outline-none focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-bold mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-6">
        {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
        {days.map(d => (
          <div key={d} className={`p-2 rounded ${d === date.getDate() ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Events List */}
      <div className="flex-grow overflow-y-auto">
        <h3 className="font-bold mb-2 border-b pb-1">Events</h3>
        {filteredEvents.length > 0 ? (
          <div className="space-y-2">
            {filteredEvents.map(event => (
              <div key={event.id} className="p-2 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">{event.title}</span>
                  <span className="text-[10px] text-gray-500">{event.date}</span>
                </div>
                <p className="text-xs text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-sm mt-4 italic">
            No events found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

const TerminalApp = () => {
  const { t } = useContext(OSContext);
  const [history, setHistory] = useState<string[]>([`${t('os_name')} Terminal Release 10.1`, 'Type "help" for commands.']);
  const [input, setInput] = useState('');

  const handleCommand = () => {
    const cmd = input.trim().toLowerCase();
    let output = '';
    if (cmd === 'help') output = 'Available commands: help, clear, date, whoami, echo [text]';
    else if (cmd === 'clear') { setHistory([]); setInput(''); return; }
    else if (cmd === 'date') output = new Date().toString();
    else if (cmd === 'whoami') output = 'Gomer';
    else if (cmd.startsWith('echo ')) output = cmd.slice(5);
    else output = `Command not found: ${cmd}`;

    setHistory(prev => [...prev, `> ${input}`, output]);
    setInput('');
  };

  return (
    <div className="bg-black text-green-500 p-2 h-full font-mono text-sm overflow-y-auto flex flex-col">
      <div className="flex-grow">
        {history.map((line, i) => <div key={i}>{line}</div>)}
      </div>
      <div className="flex">
        <span>{'>'}&nbsp;</span>
        <input 
          type="text" 
          className="bg-transparent outline-none flex-grow text-green-500" 
          autoFocus 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCommand()}
        />
      </div>
    </div>
  );
};

const StickyNotesApp = () => {
  const { t } = useContext(OSContext);
  const [notes, setNotes] = useState<{id: number, text: string, color: string}[]>([
    { id: 1, text: 'Buy milk', color: '#fff9c4' },
    { id: 2, text: `Finish ${t('os_name')}`, color: '#e1f5fe' }
  ]);

  const addNote = () => {
    setNotes(prev => [...prev, { id: Date.now(), text: '', color: '#fff9c4' }]);
  };

  return (
    <div className="bg-gray-200 p-2 h-full overflow-y-auto flex flex-wrap gap-2 content-start">
      <button className="w-full bg-blue-500 text-white p-1 rounded mb-2" onClick={addNote}>+ Add Note</button>
      {notes.map(note => (
        <div key={note.id} className="w-32 h-32 p-2 shadow-md relative" style={{ background: note.color }}>
          <textarea 
            className="w-full h-full bg-transparent outline-none resize-none text-xs text-black" 
            value={note.text}
            onChange={e => {
              const newText = e.target.value;
              setNotes(prev => prev.map(n => n.id === note.id ? { ...n, text: newText } : n));
            }}
          />
          <button 
            className="absolute top-0 right-1 text-gray-500 hover:text-red-500"
            onClick={() => setNotes(prev => prev.filter(n => n.id !== note.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

const MusicPlayerApp = () => {
  const { t } = useContext(OSContext);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('Lofi Beats - Study Session');

  return (
    <div className="bg-[#121212] text-white p-4 h-full flex flex-col items-center justify-center gap-4">
      <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-xl flex items-center justify-center">
        <img src="https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/amarok.png" alt="music" className="w-16 h-16 opacity-50" />
      </div>
      <div className="text-center">
        <div className="font-bold text-lg">{currentTrack}</div>
        <div className="text-gray-400 text-sm">{t('os_name')} Originals</div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-2xl hover:text-blue-400">⏮</button>
        <button className="text-4xl hover:text-blue-400" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸' : '▶️'}
        </button>
        <button className="text-2xl hover:text-blue-400">⏭</button>
      </div>
      <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
        <div className={`bg-blue-500 h-full ${isPlaying ? 'animate-pulse' : ''}`} style={{ width: '45%' }}></div>
      </div>
    </div>
  );
};

const CookieSoapApp = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState('Ah'); // 'Ah', 'Oh', 'Eee', 'eat', 'cry'
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let faceLandmarker: FaceLandmarker;
    let stream: MediaStream;
    let animationId: number;

    const init = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        setIsLoaded(true);

        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", predictWebcam);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load camera or AI model.");
      }
    };

    let lastVideoTime = -1;
    const predictWebcam = () => {
      if (!videoRef.current || !faceLandmarker) return;
      let startTimeMs = performance.now();
      if (lastVideoTime !== videoRef.current.currentTime) {
        lastVideoTime = videoRef.current.currentTime;
        const results = faceLandmarker.detectForVideo(videoRef.current, startTimeMs);
        
        if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
          const shapes = results.faceBlendshapes[0].categories;
          
          const getShape = (name: string) => shapes.find(s => s.categoryName === name)?.score || 0;
          
          const jawOpen = getShape("jawOpen");
          const mouthPucker = getShape("mouthPucker");
          const mouthSmile = getShape("mouthSmileLeft") + getShape("mouthSmileRight");
          const eyeBlink = getShape("eyeBlinkLeft") + getShape("eyeBlinkRight");
          const sad = getShape("mouthFrownLeft") + getShape("mouthFrownRight");

          // Only change state automatically if not in an explicit animation state
          setState(prevState => {
            if (prevState === 'eat') return prevState; // Let the user manually reset or timeout
            if (eyeBlink > 1.0 || sad > 1.0) {
              return 'cry';
            } else if (mouthPucker > 0.5) {
              return 'Oh';
            } else if (jawOpen > 0.3) {
              return 'Ah';
            } else if (mouthSmile > 0.5) {
              return 'Eee';
            } else {
              return 'Ah'; // Default
            }
          });
        }
      }
      animationId = requestAnimationFrame(predictWebcam);
    };

    init();

    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      if (animationId) cancelAnimationFrame(animationId);
      if (faceLandmarker) faceLandmarker.close();
    };
  }, []);

  const images = {
    'Oh': 'https://i.ytimg.com/vi/j_WJQ8t60ko/oar2.jpg?sqp=-oaymwEYCJUDENAFSFqQAgHyq4qpAwcIARUAAIhC&rs=AOn4CLAPokGxMzQUDo1G2_cVXGTZq8dbPA&usqp=CCk',
    'Ah': 'https://preview.redd.it/what-should-i-name-my-satire-oc-its-based-off-soap-cookie-v0-eiuse365wdxe1.png?width=108&crop=smart&auto=webp&s=a58d41dd0735501Ht6TLmpMc3xhN5euPZo5ecC4RJtfJrJu8',
    'Eee': 'https://i.ytimg.com/vi/w2o6dfIj06c/oar2.jpg?sqp=-oaymwEYCJUDENAFSFqQAgHyq4qpAwcIARUAAIhC&rs=AOn4CLBdOPl8cslEDOggYj5ff3hGN0Z7-A&usqp=CCk',
    'eat': 'https://media.tenor.com/cv7vwr-ZMsgAAAAM/soap-cookie-eat.gif',
    'cry': 'https://media1.tenor.com/m/AAFOPNALZsQAAAAC/cookie-eating.gif'
  };

  return (
    <div className="bg-pink-200 h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {!isLoaded && !error && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white z-10">Loading Face AI...</div>}
      {error && <div className="absolute inset-0 bg-red-500/80 flex flex-col items-center justify-center text-white z-10 p-4 text-center">
        <div className="font-bold text-xl mb-2">Camera Error</div>
        <div>{error}</div>
        <div className="text-sm mt-2">Please allow camera access to use this filter.</div>
      </div>}
      
      <video ref={videoRef} autoPlay playsInline className="absolute w-32 h-24 bottom-2 right-2 object-cover rounded-lg border-2 border-white shadow-lg z-20" muted></video>
      
      <img src={images[state as keyof typeof images]} alt={state} className="max-w-full max-h-full object-contain drop-shadow-2xl transition-all duration-200" />
      
      <div className="absolute bottom-4 left-4 flex gap-2 z-20">
        <button 
          className="bg-white px-3 py-1 rounded-full shadow hover:bg-gray-100 text-sm font-bold text-pink-500" 
          onClick={() => {
            setState('eat');
            setTimeout(() => setState('Ah'), 3000);
          }}
        >
          Eat Soap
        </button>
      </div>
    </div>
  );
};

const RobloxApp = () => {
  const [ageInput, setAgeInput] = useState('');
  const [message, setMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const age = parseInt(ageInput, 10);
    if (isNaN(age)) {
      setMessage("Please enter a valid age.");
      return;
    }
    
    if (age < 10) {
      setMessage("You are too young to play Roblox!");
      setIsPlaying(false);
    } else if (age > 10 && age < 100) {
      setMessage("You are too old to play Roblox!");
      setIsPlaying(false);
    } else {
      setMessage("Welcome to Roblox!");
      setIsPlaying(true);
    }
  };

  return (
    <div className="bg-[#232527] text-white h-full flex flex-col items-center justify-center p-6 text-center">
      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png" alt="Roblox" className="w-24 h-24 mb-6 bg-white rounded-xl p-2" />
      {!isPlaying ? (
        <div className="bg-[#393b3d] p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Age Verification</h2>
          <p className="text-sm text-gray-300 mb-4">Please enter your age to play Roblox.</p>
          <input 
            type="number" 
            value={ageInput}
            onChange={(e) => setAgeInput(e.target.value)}
            className="w-full p-2 rounded bg-[#232527] border border-gray-600 text-white mb-4"
            placeholder="Enter your age"
          />
          <button 
            onClick={handlePlay}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Play
          </button>
          {message && <p className="mt-4 text-red-400 font-bold">{message}</p>}
        </div>
      ) : (
        <div className="bg-[#393b3d] p-6 rounded-lg shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-green-400 mb-4">{message}</h2>
          <p className="mb-4">Loading experiences...</p>
          <div className="animate-pulse flex space-x-4 justify-center">
            <div className="rounded-full bg-slate-500 h-10 w-10"></div>
            <div className="rounded-full bg-slate-500 h-10 w-10"></div>
            <div className="rounded-full bg-slate-500 h-10 w-10"></div>
          </div>
          <button 
            onClick={() => { setIsPlaying(false); setAgeInput(''); setMessage(''); }}
            className="mt-6 text-sm text-gray-400 hover:text-white underline"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};


const VideoPlayerApp = ({ selectedVideo }: { selectedVideo: string | null }) => {
  const defaultVideoUrl = "https://1drv.ms/v/c/94c57c2eb47b51f8/IQAkfgCpPiQMRIhbsbIGOY_MAQ_No_LcQN_ousmLLwygV2Y?e=aeoTgC";
  const videoUrl = selectedVideo || defaultVideoUrl;
  return (
    <div className="bg-black h-full flex flex-col">
      <div className="flex-1 relative bg-black flex items-center justify-center">
        <iframe 
          src={videoUrl}
          className="w-full h-full border-0"
          allowFullScreen
          title="Video Player"
        ></iframe>
      </div>
      <div className="bg-[#1c1c1c] p-2 flex items-center justify-between text-white text-xs border-t border-gray-800">
        <div className="flex items-center gap-4">
          <button className="hover:text-blue-400">⏮</button>
          <button className="text-lg hover:text-blue-400">▶️</button>
          <button className="hover:text-blue-400">⏭</button>
          <span className="ml-2">00:00 / 03:45</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🔊</span>
          <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
            <div className="bg-blue-500 h-full w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WeatherApp = () => {
  const { t } = useContext(OSContext);
  return (
    <div className="bg-gradient-to-b from-blue-400 to-blue-600 text-white p-6 h-full flex flex-col items-center justify-center gap-2">
      <div className="text-6xl">☀️</div>
      <div className="text-4xl font-bold">72°F</div>
      <div className="text-xl">Sunny</div>
      <div className="mt-4 text-sm opacity-80">Gomer City, {t('os_name')}</div>
      <div className="flex gap-4 mt-6">
        <div className="text-center"><div className="text-xs opacity-70">MON</div><div>75°</div></div>
        <div className="text-center"><div className="text-xs opacity-70">TUE</div><div>68°</div></div>
        <div className="text-center"><div className="text-xs opacity-70">WED</div><div>70°</div></div>
      </div>
    </div>
  );
};

const TaskManagerApp = ({ windows }: { windows: any[] }) => {
  return (
    <div className="bg-white text-black p-2 h-full overflow-y-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Process Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">CPU</th>
          </tr>
        </thead>
        <tbody>
          {windows.map(win => (
            <tr key={win.id} className="border-b hover:bg-gray-50">
              <td className="p-2 flex items-center gap-2">
                <img src={win.icon} alt="" className="w-4 h-4" />
                {win.title}
              </td>
              <td className="p-2 text-green-600">Running</td>
              <td className="p-2">{Math.floor(Math.random() * 5)}%</td>
            </tr>
          ))}
          <tr className="border-b hover:bg-gray-50">
            <td className="p-2">System Kernel</td>
            <td className="p-2 text-green-600">Running</td>
            <td className="p-2">1.2%</td>
          </tr>
          <tr className="border-b hover:bg-gray-50">
            <td className="p-2">Desktop Manager</td>
            <td className="p-2 text-green-600">Running</td>
            <td className="p-2">0.8%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const WordApp = () => {
  const [content, setContent] = useState('Welcome to Web Word!\n\nThis is a simple document editor.');
  return (
    <div className="flex flex-col h-full bg-white text-black">
      <div className="bg-[#2b579a] text-white p-2 flex items-center gap-4 text-xs">
        <div className="font-bold">File</div>
        <div>Insert</div>
        <div>Layout</div>
        <div>References</div>
      </div>
      <div className="bg-gray-100 p-2 border-b flex gap-2">
        <button className="p-1 hover:bg-gray-200 rounded"><b>B</b></button>
        <button className="p-1 hover:bg-gray-200 rounded"><i>I</i></button>
        <button className="p-1 hover:bg-gray-200 rounded"><u>U</u></button>
        <select className="text-xs border rounded px-1"><option>Arial</option><option>Times New Roman</option></select>
      </div>
      <div className="flex-grow p-8 bg-gray-200 overflow-y-auto flex justify-center">
        <textarea 
          className="w-[80%] h-fit min-h-full bg-white shadow-lg p-12 outline-none resize-none font-serif text-sm leading-relaxed"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>
    </div>
  );
};

const ExcelApp = () => {
  const [data, setData] = useState<string[][]>(Array(20).fill(0).map(() => Array(10).fill('')));
  return (
    <div className="flex flex-col h-full bg-white text-black overflow-hidden">
      <div className="bg-[#217346] text-white p-2 flex items-center gap-4 text-xs">
        <div className="font-bold">File</div>
        <div>Home</div>
        <div>Insert</div>
        <div>Data</div>
      </div>
      <div className="flex-grow overflow-auto">
        <table className="border-collapse w-full text-xs">
          <thead>
            <tr>
              <th className="bg-gray-100 border p-1 w-8"></th>
              {Array(10).fill(0).map((_, i) => (
                <th key={i} className="bg-gray-100 border p-1 w-24 font-normal">{String.fromCharCode(65 + i)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, ri) => (
              <tr key={ri}>
                <td className="bg-gray-100 border p-1 text-center">{ri + 1}</td>
                {row.map((cell, ci) => (
                  <td key={ci} className="border p-0">
                    <input 
                      className="w-full h-full p-1 outline-none focus:border-green-500 focus:border-2" 
                      value={cell}
                      onChange={e => {
                        const newData = [...data];
                        newData[ri][ci] = e.target.value;
                        setData(newData);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-100 p-1 border-t text-[10px] flex gap-4">
        <div className="bg-white px-2 border-t-2 border-green-600">Sheet1</div>
        <div className="opacity-50">+</div>
      </div>
    </div>
  );
};

const PowerPointApp = () => {
  const [slides, setSlides] = useState([{ id: 1, title: 'Click to add title', subtitle: 'Click to add subtitle' }]);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <div className="flex flex-col h-full bg-white text-black overflow-hidden">
      <div className="bg-[#d24726] text-white p-2 flex items-center gap-4 text-xs">
        <div className="font-bold">File</div>
        <div>Home</div>
        <div>Transitions</div>
        <div>Slide Show</div>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-48 bg-gray-100 border-r overflow-y-auto p-2 flex flex-col gap-2">
          {slides.map((s, i) => (
            <div 
              key={s.id} 
              className={`border p-2 cursor-pointer aspect-video bg-white text-[6px] flex flex-col justify-center items-center gap-1 ${activeSlide === i ? 'border-orange-500 border-2' : 'border-gray-300'}`}
              onClick={() => setActiveSlide(i)}
            >
              <div className="font-bold">{s.title}</div>
              <div className="opacity-50">{s.subtitle}</div>
            </div>
          ))}
          <button className="text-xs text-orange-600 font-bold p-2 hover:bg-orange-50" onClick={() => setSlides([...slides, { id: Date.now(), title: 'New Slide', subtitle: '' }])}>+ New Slide</button>
        </div>
        <div className="flex-grow bg-gray-200 p-8 flex items-center justify-center overflow-auto">
          <div className="bg-white shadow-2xl aspect-video w-full max-w-2xl flex flex-col items-center justify-center p-12 text-center gap-4">
            <input 
              className="text-4xl font-bold w-full outline-none border-b border-transparent focus:border-gray-200 p-2" 
              value={slides[activeSlide].title}
              onChange={e => {
                const newSlides = [...slides];
                newSlides[activeSlide].title = e.target.value;
                setSlides(newSlides);
              }}
            />
            <input 
              className="text-xl text-gray-500 w-full outline-none border-b border-transparent focus:border-gray-200 p-2" 
              value={slides[activeSlide].subtitle}
              onChange={e => {
                const newSlides = [...slides];
                newSlides[activeSlide].subtitle = e.target.value;
                setSlides(newSlides);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const WineApp = () => {
  const { setApps, playSound, showNotification } = useContext(OSContext);
  const [installing, setInstalling] = useState<string | null>(null);

  const installableApps = [
    { id: 'steam', name: 'Steam', icon: 'https://files.softicons.com/download/application-icons/circle-icons-by-martz90/png/128x128/steam.png' },
    { id: 'outlook', name: 'Outlook 2010', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/outlook_win.png' },
    { id: 'eve', name: 'Eve Online', icon: 'https://files.softicons.com/download/game-icons/eve-online-icons-by-eve-online/png/128x128/eve_online.png' },
    { id: 'photoshop', name: 'Photoshop CC 2015', icon: 'https://files.softicons.com/download/adobe-icons/adobe-creative-suite-6-icons-by-dakirby309/png/128x128/Adobe%20Photoshop%20CS6.png' },
    { id: 'fallout', name: 'Fallout NV', icon: 'https://files.softicons.com/download/game-icons/fallout-3-icons-by-iconshock/png/128x128/fallout_3.png' },
    { id: 'reason', name: 'Reason', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/krec.png' },
    { id: 'skyrim', name: 'Skyrim Special Ed', icon: 'https://files.softicons.com/download/game-icons/skyrim-icons-by-iconshock/png/128x128/skyrim.png' },
    { id: 'gog', name: 'GOG Galaxy', icon: 'https://files.softicons.com/download/application-icons/circle-icons-by-martz90/png/128x128/gog.png' },
    { id: 'wizard101', name: 'Wizard101', icon: 'https://files.softicons.com/download/game-icons/wizard101-icons-by-kingsisle-entertainment/png/128x128/wizard101.png' },
    { id: 'matlab', name: 'Matlab', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/calc.png' },
    { id: 'sims3', name: 'Sims 3', icon: 'https://files.softicons.com/download/game-icons/the-sims-3-icons-by-electronic-arts/png/128x128/the_sims_3.png' },
    { id: 'metatrader', name: 'MetaTrader 5', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kchart.png' },
    { id: 'powerpoint', name: 'PowerPoint', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/pptx_win.png' },
    { id: 'cydia', name: 'Cydia', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png' },
    { id: '000', name: '000.exe', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png' },
    { id: 'chrome', name: 'Chrome Web Store', icon: 'https://files.softicons.com/download/system-icons/google-chrome-icons-by-dakirby309/png/128x128/Google%20Chrome.png' },
    { id: 'utorrent', name: 'uTorrent', icon: 'https://files.softicons.com/download/application-icons/round-app-icons-by-ampeross/png/48x48/uTorrent.png' }
  ];

  const handleInstall = (appId: string) => {
    if (appId === 'utorrent') {
      playSound('error');
      showNotification("Wine Error: uTorrent is not compatible with WebUx (Error 0x80004005)");
      return;
    }

    setInstalling(appId);
    setTimeout(() => {
      setApps((prev: any) => ({
        ...prev,
        [appId]: { ...prev[appId], isDownloaded: true }
      }));
      setInstalling(null);
      playSound('notification');
      showNotification(`${appId} installed successfully via Wine!`);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] text-black p-4 font-sans">
      <div className="flex items-center gap-3 mb-6 border-b pb-4">
        <img src="https://files.softicons.com/download/system-icons/oxygen-icons-by-oxygen/png/48x48/apps/wine_doors.png" className="w-12 h-12" />
        <div>
          <h2 className="text-xl font-bold">Wine Windows Program Loader</h2>
          <p className="text-xs text-gray-600">Running Windows apps on Linux & WebUx</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-2">
        {installableApps.map(app => (
          <div key={app.id} className="flex items-center justify-between bg-white p-3 rounded border shadow-sm hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <img src={app.icon} className="w-8 h-8" />
              <span className="font-medium">{app.name}</span>
            </div>
            <button 
              onClick={() => handleInstall(app.id)}
              disabled={installing !== null}
              className={`px-4 py-1 rounded text-sm font-bold text-white ${installing === app.id ? 'bg-orange-400' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
            >
              {installing === app.id ? 'Installing...' : 'Install'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-auto pt-4 text-[10px] text-gray-400 text-center">
        Wine version 9.0 (WebUx Edition)
      </div>
    </div>
  );
};

const WinXPHorrorApp = () => {
  const [stage, setStage] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col h-full bg-black text-red-600 font-serif overflow-hidden relative ${glitch ? 'invert grayscale' : ''}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
      
      <div className="p-8 flex flex-col items-center justify-center h-full text-center gap-6">
        <img 
          src="https://files.softicons.com/download/toolbar-icons/free-red-button-icons-by-aha-soft/png/48x48/hard%20disk.png" 
          className="w-24 h-24 animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.5)]" 
        />
        <h1 className="text-4xl font-bold tracking-widest uppercase text-red-700">Windows XP</h1>
        <p className="text-xl italic">Horror Edition</p>
        
        <div className="mt-8 border-2 border-red-900 p-6 bg-black/50 backdrop-blur-sm max-w-md">
          <p className="text-sm leading-relaxed mb-4">
            "The system has encountered a fatal error that cannot be resolved by human hands. 
            Your files are no longer yours. They belong to the void now."
          </p>
          <button 
            className="px-6 py-2 bg-red-900 text-white hover:bg-red-700 transition-colors font-bold border border-red-500"
            onClick={() => setStage(s => s + 1)}
          >
            {stage === 0 ? "ACCEPT YOUR FATE" : "THERE IS NO ESCAPE"}
          </button>
        </div>
      </div>
      
      {stage > 0 && (
        <div className="absolute bottom-4 right-4 text-[10px] opacity-30">
          Error Code: 0x666_DEATH
        </div>
      )}

      <style>{`
        @keyframes horror-shake {
          0% { transform: translate(0,0); }
          25% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, 1px); }
          75% { transform: translate(1px, -2px); }
          100% { transform: translate(0,0); }
        }
        .horror-shake { animation: horror-shake 0.1s infinite; }
      `}</style>
    </div>
  );
};

const SteamApp = () => {
  const [activeTab, setActiveTab] = useState('store');
  return (
    <div className="flex flex-col h-full bg-[#1b2838] text-[#c7d5e0] font-sans overflow-hidden">
      <div className="flex items-center gap-4 p-2 bg-[#171a21] border-b border-[#2a475e]">
        <img src="https://files.softicons.com/download/application-icons/circle-icons-by-martz90/png/128x128/steam.png" className="w-6 h-6" />
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
          <button onClick={() => setActiveTab('store')} className={activeTab === 'store' ? 'text-white border-b-2 border-blue-500' : 'hover:text-white'}>Store</button>
          <button onClick={() => setActiveTab('library')} className={activeTab === 'library' ? 'text-white border-b-2 border-blue-500' : 'hover:text-white'}>Library</button>
          <button onClick={() => setActiveTab('community')} className={activeTab === 'community' ? 'text-white border-b-2 border-blue-500' : 'hover:text-white'}>Community</button>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4">
        {activeTab === 'store' && (
          <div className="space-y-4">
            <div className="h-40 bg-gradient-to-r from-blue-900 to-black rounded flex items-end p-4">
              <h2 className="text-2xl font-bold italic">SUMMER SALE IS HERE</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['Counter-Strike 2', 'Dota 2', 'Cyberpunk 2077', 'Elden Ring'].map(game => (
                <div key={game} className="bg-[#2a475e] p-2 rounded hover:bg-[#3d6c8d] cursor-pointer transition-colors">
                  <div className="h-24 bg-black/50 rounded mb-2 flex items-center justify-center text-xs opacity-50">Game Image</div>
                  <div className="font-bold text-sm">{game}</div>
                  <div className="text-xs text-blue-400 mt-1">$59.99</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'library' && (
          <div className="flex flex-col gap-2">
            <div className="text-xs font-bold text-gray-500 mb-2">ALL GAMES (4)</div>
            {['Fallout: New Vegas', 'Skyrim', 'The Sims 3', 'Wizard101'].map(game => (
              <div key={game} className="p-2 hover:bg-white/10 rounded cursor-pointer flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm">{game}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PhotoshopApp = () => {
  const [tool, setTool] = useState('brush');
  return (
    <div className="flex flex-col h-full bg-[#333333] text-white font-sans overflow-hidden">
      <div className="flex items-center gap-4 px-2 py-1 bg-[#222222] text-[10px] border-b border-black">
        <span>File</span><span>Edit</span><span>Image</span><span>Layer</span><span>Type</span><span>Select</span><span>Filter</span><span>View</span><span>Window</span><span>Help</span>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-10 bg-[#2b2b2b] flex flex-col items-center py-2 gap-4 border-r border-black">
          {['selection', 'crop', 'brush', 'eraser', 'text', 'zoom'].map(t => (
            <button key={t} onClick={() => setTool(t)} className={`p-1 rounded ${tool === t ? 'bg-blue-600' : 'hover:bg-white/10'}`}>
              <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
            </button>
          ))}
        </div>
        <div className="flex-grow bg-[#1a1a1a] flex items-center justify-center p-8 overflow-auto">
          <div className="w-[400px] h-[300px] bg-white shadow-2xl relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-200 font-bold text-4xl uppercase tracking-widest opacity-20">Untitled-1</div>
          </div>
        </div>
        <div className="w-48 bg-[#2b2b2b] border-l border-black flex flex-col text-[10px]">
          <div className="p-2 bg-[#3a3a3a] border-b border-black font-bold">Layers</div>
          <div className="flex-grow p-2 space-y-1">
            <div className="flex items-center gap-2 bg-blue-900/50 p-1 rounded border border-blue-500">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
              <span>Layer 1</span>
            </div>
            <div className="flex items-center gap-2 p-1 opacity-50">
              <div className="w-4 h-4 bg-gray-600 rounded-sm"></div>
              <span>Background</span>
            </div>
          </div>
        </div>
      </div>
      <div className="h-5 bg-[#222222] border-t border-black px-2 flex items-center text-[9px] text-gray-400">
        100% | Doc: 450.0K/0 bytes | Layer: Layer 1
      </div>
    </div>
  );
};

const OutlookApp = () => {
  return (
    <div className="flex flex-col h-full bg-white text-black font-sans overflow-hidden">
      <div className="bg-[#0072c6] text-white p-2 flex items-center gap-4">
        <div className="font-bold">Outlook 2010</div>
        <div className="flex gap-3 text-xs opacity-80">
          <span>Send / Receive</span><span>Folder</span><span>View</span>
        </div>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className="w-48 bg-[#f3f3f3] border-r flex flex-col p-2 text-sm">
          <div className="font-bold mb-2">Favorites</div>
          <div className="pl-2 space-y-1">
            <div className="text-blue-600 font-bold">Inbox (12)</div>
            <div>Sent Items</div>
            <div>Deleted Items</div>
          </div>
        </div>
        <div className="w-64 border-r flex flex-col overflow-y-auto">
          {[
            { from: 'Microsoft Support', subject: 'Welcome to Outlook', date: '10:15 AM' },
            { from: 'Darius', subject: 'Project Update', date: 'Yesterday' },
            { from: 'Gomer', subject: 'Lunch?', date: 'Monday' },
            { from: 'WineHQ', subject: 'Wine 11.6 Released', date: 'Friday' }
          ].map((mail, i) => (
            <div key={i} className={`p-3 border-b hover:bg-blue-50 cursor-pointer ${i === 0 ? 'bg-blue-100 border-l-4 border-blue-600' : ''}`}>
              <div className="font-bold text-sm">{mail.from}</div>
              <div className="text-xs text-gray-600 truncate">{mail.subject}</div>
              <div className="text-[10px] text-gray-400 text-right">{mail.date}</div>
            </div>
          ))}
        </div>
        <div className="flex-grow p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Welcome to Outlook</h2>
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 border-b pb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">M</div>
            <div>
              <div className="text-black font-bold">Microsoft Support</div>
              <div>To: Gomer &lt;gomer@webux.os&gt;</div>
            </div>
          </div>
          <div className="text-sm leading-relaxed text-gray-800">
            Hello Gomer,<br/><br/>
            Thank you for choosing Microsoft Outlook 2010. We are excited to help you manage your communications and schedule more effectively.<br/><br/>
            Best regards,<br/>
            The Outlook Team
          </div>
        </div>
      </div>
    </div>
  );
};

const GenericWindowsApp = ({ name, icon }: { name: string, icon: string }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white font-mono">
        <img src={icon} className="w-16 h-16 mb-4 animate-pulse" />
        <div className="text-xs">Loading {name}...</div>
        <div className="w-48 h-1 bg-gray-800 mt-4 overflow-hidden rounded-full">
          <div className="h-full bg-blue-500 animate-[loading_2s_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] text-black font-sans overflow-hidden border border-gray-400">
      <div className="bg-gradient-to-b from-[#ebeadb] to-[#d2d1c0] p-1 flex items-center gap-2 border-b border-gray-400 text-xs">
        <span>File</span><span>Edit</span><span>View</span><span>Help</span>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
        <img src={icon} className="w-32 h-32 mb-6 drop-shadow-xl" />
        <h2 className="text-2xl font-bold mb-2">{name}</h2>
        <p className="text-sm text-gray-600 max-w-xs">
          This Windows application is running successfully via the Wine compatibility layer on WebUx.
        </p>
        <div className="mt-8 p-4 bg-white border border-gray-300 rounded shadow-inner text-left w-full max-w-sm">
          <div className="text-[10px] font-bold text-gray-400 uppercase mb-2">System Output</div>
          <code className="text-[10px] block font-mono text-green-700">
            wine: created new prefix '/home/user/.wine'<br/>
            wine: loading executable...<br/>
            wine: process started (PID: {Math.floor(Math.random() * 9000) + 1000})<br/>
            fixme:ntdll:NtQuerySystemInformation info_class SYSTEM_PERFORMANCE_INFORMATION not implemented
          </code>
        </div>
      </div>
    </div>
  );
};

const ZeroZeroZeroApp = () => {
  const [glitch, setGlitch] = useState(false);
  useEffect(() => {
    const i = setInterval(() => setGlitch(prev => !prev), 2000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className={`flex flex-col h-full bg-black text-red-600 font-mono p-4 overflow-hidden relative ${glitch ? 'invert' : ''}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-50"></div>
      <div className="z-10 flex flex-col h-full">
        <div className="text-xs mb-4 border-b border-red-900 pb-2">000.EXE - KERNEL ACCESS GRANTED</div>
        <div className="flex-grow space-y-2 overflow-y-auto scrollbar-hide">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="text-[10px] opacity-80">
              [SYSTEM] CRITICAL ERROR AT 0x{Math.random().toString(16).slice(2, 10).toUpperCase()} - DATA CORRUPTION DETECTED
            </div>
          ))}
          <div className="text-2xl font-bold animate-pulse mt-4">YOU SHOULD NOT BE HERE</div>
          <div className="text-sm italic opacity-50">"The disk is screaming. Can you hear it?"</div>
        </div>
        <div className="mt-auto pt-4 flex justify-between items-end">
          <div className="text-[8px] opacity-30">BUILD: 0.0.0_VOID</div>
          <img src="https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png" className="w-12 h-12 grayscale invert opacity-20" />
        </div>
      </div>
    </div>
  );
};

const MacStarsApp = () => {
  const [showCircle, setShowCircle] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play().catch(() => {});
    
    const check = setInterval(() => {
      if (v.currentTime >= 2.8) {
        clearInterval(check);
        v.pause();
        v.currentTime = 2.8;
        setShowCircle(true);
        setTimeout(() => {
          setShowCircle(false);
          v.play().catch(() => {});
        }, 1500);
      }
    }, 10);
    return () => clearInterval(check);
  }, []);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
      <video ref={videoRef} className="w-full" src="https://static.mindvideo.ai/mindvideo/watermark/ZaOFb77pebr91lqZ00XK4oTt2VNUeW1Y8uBCaZai.mp4" />
      {showCircle && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-[12px] border-red-600 rounded-full z-50 pointer-events-none" />
      )}
    </div>
  );
};

const Win9App = () => {
  return (
    <iframe src="/win9.html" className="w-full h-full border-none" />
  );
};

const VMwareApp = () => {
  const { openWindow, playSound } = useContext(OSContext);
  const [selectedVM, setSelectedVM] = useState<string | null>(null);
  const [isPoweringOn, setIsPoweringOn] = useState(false);

  const vms = [
    { id: 'win9', name: 'Windows 9 Infinite', os: 'Windows 9', status: 'Off' },
    { id: 'winxphorror', name: 'Windows XP Horror', os: 'Windows XP', status: 'Off' },
    { id: 'w3', name: 'Windows 3.1', os: 'DOS', status: 'Off' }
  ];

  const handlePowerOn = () => {
    if (!selectedVM) return;
    setIsPoweringOn(true);
    playSound('startup');
    setTimeout(() => {
      openWindow(selectedVM);
      setIsPoweringOn(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#212121] text-white font-sans">
      <div className="bg-[#333] p-2 flex items-center gap-4 border-b border-[#444]">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vmware.svg/1200px-Vmware.svg.png" className="h-6" alt="VMware" />
        <div className="flex gap-4 text-sm">
          <button className="hover:text-blue-400">File</button>
          <button className="hover:text-blue-400">Edit</button>
          <button className="hover:text-blue-400">View</button>
          <button className="hover:text-blue-400">VM</button>
          <button className="hover:text-blue-400">Tabs</button>
          <button className="hover:text-blue-400">Help</button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-[#2b2b2b] border-r border-[#444] p-4 flex flex-col gap-2">
          <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Library</h4>
          {vms.map(vm => (
            <div 
              key={vm.id}
              onClick={() => setSelectedVM(vm.id)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedVM === vm.id ? 'bg-blue-600' : 'hover:bg-[#3d3d3d]'}`}
            >
              <span className="text-lg">💻</span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{vm.name}</span>
                <span className="text-[10px] opacity-60">{vm.os}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#1e1e1e]">
          {selectedVM ? (
            <div className="max-w-md w-full flex flex-col gap-6">
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 bg-[#2b2b2b] rounded-lg flex items-center justify-center text-4xl border border-[#444]">
                  💻
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-3xl font-bold">{vms.find(v => v.id === selectedVM)?.name}</h2>
                  <span className="text-green-400 text-sm">● Powered Off</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={handlePowerOn}
                  disabled={isPoweringOn}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 p-4 rounded-lg flex items-center justify-center gap-3 font-bold transition-colors"
                >
                  {isPoweringOn ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <span>▶️</span>
                  )}
                  Power on this virtual machine
                </button>
                <button className="bg-[#3d3d3d] hover:bg-[#4d4d4d] p-4 rounded-lg flex items-center justify-center gap-3 font-bold transition-colors">
                  ⚙️ Edit virtual machine settings
                </button>
              </div>

              <div className="mt-8 border-t border-[#444] pt-6">
                <h5 className="text-sm font-bold text-gray-400 mb-4">Device Summary</h5>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  <div className="text-gray-500">Memory</div>
                  <div>4 GB</div>
                  <div className="text-gray-500">Processors</div>
                  <div>2</div>
                  <div className="text-gray-500">Hard Disk (SCSI)</div>
                  <div>60 GB</div>
                  <div className="text-gray-500">Network Adapter</div>
                  <div>Bridged (Automatic)</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vmware.svg/1200px-Vmware.svg.png" className="w-48 opacity-20 mx-auto mb-6" alt="VMware" />
              <p className="text-xl">Select a virtual machine to begin</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-[#0078d7] p-1 text-[10px] flex justify-between px-4">
        <span>Ready</span>
        <span>VMware Workstation 17 Pro</span>
      </div>
    </div>
  );
};

const MsPompApp = () => {
  const { t } = useContext(OSContext);
  const [messages, setMessages] = useState([
    { sender: 'pomp', text: 'Hello! I am Ms. Pomp, your helpful assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const sendMsg = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg = { sender: 'user', text: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setIsThinking(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: input,
        config: {
          systemInstruction: `You are Ms. Pomp, a sweet, helpful, and slightly motherly assistant in a simulated ${t('os_name')}. You are always kind, encouraging, and use a gentle tone. You love helping Gomer (the user) with his computer tasks. Keep your responses concise but very sweet.`,
        }
      });

      const aiText = response.text || "I'm so sorry, dear, but I'm having a little trouble thinking right now. Could you try again?";
      setMessages(prev => [...prev, { sender: 'pomp', text: aiText }]);
    } catch (error) {
      console.error("Ms. Pomp Error:", error);
      setMessages(prev => [...prev, { sender: 'pomp', text: "Oh dear, it seems something went wrong. I'll be here when you're ready to try again, sweetie!" }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-black">
      <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-2">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded-lg max-w-[80%] ${m.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'}`}>
            <div className="text-[10px] font-bold opacity-50 mb-1">{m.sender === 'user' ? 'You' : 'Ms. Pomp'}</div>
            <div className="text-sm">{m.text}</div>
          </div>
        ))}
        {isThinking && (
          <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 self-start animate-pulse">
            <div className="text-[10px] font-bold opacity-50 mb-1">Ms. Pomp</div>
            <div className="text-sm italic">Thinking sweetly...</div>
          </div>
        )}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input 
          type="text" 
          className="flex-grow border rounded px-3 py-2 outline-none focus:border-blue-500" 
          placeholder={isThinking ? "Ms. Pomp is thinking..." : "Ask Ms. Pomp..."}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg()}
          disabled={isThinking}
        />
        <button 
          className={`bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-opacity ${isThinking ? 'opacity-50 cursor-not-allowed' : ''}`} 
          onClick={sendMsg}
          disabled={isThinking}
        >
          Send
        </button>
      </div>
    </div>
  );
};

const Clippy = ({ windowInstances }: { windowInstances: any[] }) => {
  const { playSound, isGirlyMode } = useContext(OSContext);
  const [visible, setVisible] = useState(true);
  const [message, setMessage] = useState("Hello");
  const [position, setPosition] = useState({ bottom: '50px', right: '20px', top: 'auto', left: 'auto' });
  const [mood, setMood] = useState('happy');
  const [isJudging, setIsJudging] = useState(false);
  const [clones, setClones] = useState<any[]>([]);
  const [hasBrowser, setHasBrowser] = useState(false);

  const clippyImg = isGirlyMode 
    ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfO-9dQ4PZuM3AHjatGZ5FfDR2PE6kbfGTbQ&s"
    : "https://static.wikia.nocookie.net/animatorvsanimation/images/f/f9/Clippit.webp/revision/latest/thumbnail/width/360/height/360?cb=20230904171324";

  const normalPhrases = [
    "Hello", "greetings!", "if ur fucking depressed and i know i it clap ur hands!",
    "FUCK OFF APK BUDDY!", "Bonjour!", "Did i pick a bad time?",
    "Word deleted me? im gonna delete them!",
    "I SWEAR IF YOU SEND ONE MORE CLIPPY R34 IMAGES ILL TEAR U TO PEICES!",
    "Goodbye!", "I HATE THIS!", "Damn...",
    "heh... heh... HELLO??",
    "Press Alt+F4 for free internet speed",
    "Je suis un trombone... wait, why am I speaking French? ERROR 404.",
    "Hola! I mean... guten tag! I mean... *dial-up noises*"
  ];

  useEffect(() => {
    const browserOpen = windowInstances.some(w => w.appId === 'browser' || w.appId === 'bowser' || w.appId === 'chrome');
    if (browserOpen && !hasBrowser) {
      setMessage("...");
      setVisible(true);
    }
    setHasBrowser(browserOpen);
  }, [windowInstances, hasBrowser]);

  useEffect(() => {
    if (windowInstances.length > 6) {
      if (clones.length < 10) {
        setClones(c => [...c, { id: Math.random(), left: Math.random() * 80 + '%', top: Math.random() * 80 + '%' }]);
      }
    } else {
      setClones([]);
    }
  }, [windowInstances.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const willBeVisible = Math.random() > 0.2; // 80% chance to be visible if it changes
        setVisible(willBeVisible);
        
        if (willBeVisible) {
          const corners = [
            { bottom: '50px', right: '20px', top: 'auto', left: 'auto' },
            { bottom: '50px', left: '20px', top: 'auto', right: 'auto' },
            { top: '50px', right: '20px', bottom: 'auto', left: 'auto' },
            { top: '50px', left: '20px', bottom: 'auto', right: 'auto' }
          ];
          setPosition(corners[Math.floor(Math.random() * corners.length)]);
          
          const moods = ['happy', 'angry', 'broken', 'cursed', 'chaotic'];
          setMood(moods[Math.floor(Math.random() * moods.length)]);

          if (Math.random() > 0.95) {
            setMessage("I remember everything...");
          } else {
            setMessage(normalPhrases[Math.floor(Math.random() * normalPhrases.length)]);
          }
          setIsJudging(false);
        }
      }
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      setMessage("*silently judging you*");
      setIsJudging(true);
    }, 20000);
    return () => clearTimeout(timeout);
  }, [message, visible]);

  const handleClick = () => {
    const s = ['boing', 'error', 'ding'][Math.floor(Math.random() * 3)] as any;
    playSound(s);
    setMessage(normalPhrases[Math.floor(Math.random() * normalPhrases.length)]);
    setIsJudging(false);
    setMood(['happy', 'angry', 'broken', 'cursed', 'chaotic'][Math.floor(Math.random() * 5)]);
  };

  if (!visible && clones.length === 0) return null;

  const getMoodStyle = () => {
    switch(mood) {
      case 'angry': return { filter: 'sepia(1) hue-rotate(-50deg) saturate(5) contrast(2)' };
      case 'cursed': return { filter: 'invert(1) contrast(1.5)' };
      case 'broken': return { animation: 'glitch 0.2s infinite' };
      case 'chaotic': return { animation: 'spin 1s linear infinite' };
      default: return {};
    }
  };

  return (
    <>
      {visible && (
        <div style={{ position: 'fixed', zIndex: 999999, ...position, transition: 'all 0.5s ease' }} className="flex flex-col items-center">
          <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 mb-2 shadow-lg max-w-[200px] text-black text-sm relative font-sans">
            {message}
            <div className="absolute bottom-[-8px] right-6 w-4 h-4 bg-yellow-100 border-b-2 border-r-2 border-yellow-400 transform rotate-45"></div>
          </div>
          <img 
            src={clippyImg} 
            alt="Clippy" 
            className="w-24 h-24 cursor-pointer hover:scale-110 transition-transform"
            style={getMoodStyle()}
            onClick={handleClick}
          />
        </div>
      )}
      {clones.map(c => (
        <img 
          key={c.id}
          src={clippyImg} 
          alt="Clippy Clone" 
          className="fixed w-16 h-16 opacity-50 pointer-events-none"
          style={{ left: c.left, top: c.top, zIndex: 999998, filter: 'hue-rotate(90deg)' }}
        />
      ))}
    </>
  );
};

const VideoEditorApp = () => {
  const { playSound, showNotification, createNewFile, t } = useContext(OSContext);
  const [layers, setLayers] = useState<{id: string, text: string}[]>([{ id: '1', text: 'My Epic Video' }]);

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-white">
      <div className="flex bg-[#333] border-b border-[#444] p-2 items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wide">{t('os_name')} Video Editor</h3>
        <button 
          className="bg-green-600 hover:bg-green-500 text-xs px-4 py-1 rounded"
          onClick={() => {
            playSound('startup');
            showNotification('Exporting to desktop as MP4...');
            setTimeout(() => {
              createNewFile('My Rendered Video', 'file', 'videoeditor', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
              showNotification('Video exported to Desktop as MP4!');
            }, 2000);
          }}
        >
          Export MP4
        </button>
      </div>
      
      <div className="flex-grow flex p-4 pb-0 h-1/2">
        {/* Preview Screen */}
        <div className="flex-1 bg-black rounded-lg border border-gray-700 flex items-center justify-center overflow-hidden relative">
           <img src="https://picsum.photos/seed/video/800/450" className="w-full h-full object-cover opacity-50" />
           <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              {layers.map(l => (
                 <div key={l.id} className="text-4xl font-black text-white drop-shadow-xl">{l.text}</div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="h-1/3 bg-[#252526] border-t border-[#3c3c3c] flex flex-col mt-4">
        <div className="flex bg-[#1e1e1e] p-2 border-b border-[#3c3c3c]">
          <button 
            className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded mr-2"
            onClick={() => setLayers([...layers, { id: Date.now().toString(), text: 'New Text Layer' }])}
          >
            + Add Text Layer
          </button>
          <button 
            className="text-xs bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded"
            onClick={() => setLayers([])}
          >
            Clear Timeline
          </button>
        </div>
        <div className="flex-1 p-2 overflow-y-auto">
           {layers.map(l => (
             <div key={l.id} className="flex items-center gap-2 bg-[#333] p-2 mb-2 rounded border border-[#444]">
               <span className="text-xs w-16 opacity-50">Text Layer</span>
               <input 
                 className="flex-1 bg-[#111] text-white text-xs px-2 py-1 rounded border border-[#555] outline-none focus:border-blue-500"
                 value={l.text}
                 onChange={(e) => {
                   setLayers(layers.map(layer => layer.id === l.id ? { ...layer, text: e.target.value } : layer))
                 }}
               />
               <button 
                 className="text-red-400 hover:text-red-300 text-xs px-2"
                 onClick={() => setLayers(layers.filter(layer => layer.id !== l.id))}
               >
                 Remove
               </button>
             </div>
           ))}
           {layers.length === 0 && (
              <div className="text-xs text-gray-500 italic p-4 text-center">Timeline is empty. Add some media!</div>
           )}
        </div>
      </div>
    </div>
  );
};

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
// @ts-ignore
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const generateVerificationCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const OobeSetupScreen = ({ onComplete, t, setTaskbarColor, setUserName, userName }: any) => {
  const [step, setStep] = useState(0);
  const [prevUsed, setPrevUsed] = useState<boolean | null>(null);
  const [pcName, setPcName] = useState('My Awesome PC');
  const [tempUserName, setTempUserName] = useState(userName);
  const [verificationCode, setVerificationCode] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.displayName) {
        setTempUserName(result.user.displayName);
        setUserName(result.user.displayName);
      }
      setVerificationCode(generateVerificationCode());
      nextStep();
    } catch (error) {
      console.error("Authentication failed", error);
      alert("Login failed, please try again.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[110000] bg-blue-900 text-white flex flex-col items-center justify-center font-sans">
      <div className="w-[600px] max-w-[90%] bg-white text-black p-8 rounded-lg shadow-2xl flex flex-col items-center text-center">
        {step === 0 && (
          <>
            <img src="https://files.softicons.com/download/web-icons/webtoys-icons-by-artdesigner.lv/png/64x64/Question_mark.png" className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Welcome to {t('os_name')}!</h2>
            <p className="mb-8 text-gray-600">Have you used {t('os_name')} (formerly AICESOS) before in your life?</p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition" onClick={() => { setPrevUsed(true); nextStep(); }}>Yes, I'm a veteran</button>
              <button className="bg-gray-200 text-black px-6 py-2 rounded font-bold hover:bg-gray-300 transition" onClick={() => { setPrevUsed(false); nextStep(); }}>No, this is my first time</button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <img src="https://files.softicons.com/download/application-icons/170-dock-icons-by-adrenn/png/48/wifi.png" className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Let's get you connected</h2>
            <p className="mb-4 text-gray-600">We detected the following internet connection:</p>
            <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded mb-8 font-mono">
              Status: {navigator.onLine ? 'ONLINE' : 'OFFLINE'} <br/>
              Type: {(navigator as any).connection?.effectiveType || 'Broadband'}
            </div>
            <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition" onClick={nextStep}>Looks Good, Continue</button>
          </>
        )}
        {step === 2 && (
          <>
            <img src="https://files.softicons.com/download/web-icons/free-3d-glossy-icons-by-aha-soft/png/48x48/Color%20palette.png" className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Pick a primary color</h2>
            <p className="mb-6 text-gray-600">What color should we set the PC for?</p>
            <div className="flex justify-center gap-4 mb-8">
              {['rgba(0,0,0,0.5)', 'rgba(0,0,255,0.5)', 'rgba(255,0,0,0.5)', 'rgba(0,128,0,0.5)', 'rgba(255,105,180,0.5)'].map(c => (
                <button 
                  key={c} 
                  className="w-12 h-12 rounded-full border-4 border-gray-200 hover:scale-110 transition"
                  style={{ backgroundColor: c }}
                  onClick={() => { setTaskbarColor(c); nextStep(); }}
                />
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <img src="https://files.softicons.com/download/android-icons/cold-fusion-hd-icons-by-chris-banks/png/59x60/pc_black.png" className="w-16 h-16 mb-6 inline-block" />
            <h2 className="text-2xl font-bold mb-4">What should we call your PC?</h2>
            <input 
              type="text" 
              className="w-full max-w-sm border-2 border-gray-300 p-3 rounded mb-8 text-center text-lg outline-none focus:border-blue-500"
              value={pcName}
              onChange={e => setPcName(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition" onClick={nextStep}>Next</button>
          </>
        )}
        {step === 4 && (
          <>
            <img src="https://files.softicons.com/download/system-icons/oxygen-icons-by-oxygen/png/48x48/mimetypes/application_x_mswrite.png" className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-bold mb-4">What's your name?</h2>
            <input 
              type="text" 
              className="w-full max-w-sm border-2 border-gray-300 p-3 rounded mb-8 text-center text-lg outline-none focus:border-blue-500"
              value={tempUserName}
              onChange={e => setTempUserName(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 transition" onClick={() => { setUserName(tempUserName); nextStep(); }}>Next</button>
          </>
        )}
        {step === 5 && (
          <>
            <img src="https://files.softicons.com/download/android-icons/lipse-icons-by-vanessaem/png/48x48/gplus.png" className="w-16 h-16 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Sign in with Google</h2>
            <p className="mb-6 text-gray-600">Connect your account securely to generate your verification code.</p>
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 transition flex items-center justify-center gap-3 m-auto w-full max-w-xs shadow" 
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-6 h-6 bg-white rounded-full p-0.5" />
              {isAuthenticating ? 'Signing in...' : 'Sign in with Google'}
            </button>
            <button className="text-sm text-gray-500 mt-6 underline" onClick={nextStep}>Skip without logging in</button>
          </>
        )}
        {step === 6 && (
          <>
            <img src="https://files.softicons.com/download/toolbar-icons/crystal-office-icon-set-by-mediajon/png/48x48/ok.png" className="w-16 h-16 mb-6" />
            <h2 className="text-3xl font-bold text-green-600 mb-4">All set!</h2>
            {verificationCode && (
              <div className="mb-6 w-full">
                <p className="text-sm text-gray-500 mb-2 uppercase font-bold">Your Official Setup Code:</p>
                <div className="bg-gray-100 border-2 border-dashed border-gray-300 p-4 font-mono text-2xl tracking-widest text-blue-800 rounded select-all break-all">
                  {verificationCode}
                </div>
              </div>
            )}
            <p className="mb-8 text-gray-600">Your PC is ready to go. Enjoy {t('os_name')}!</p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition shadow-lg hover:shadow-xl" onClick={onComplete}>Boot to OS</button>
          </>
        )}
      </div>
    </div>
  );
};


const MazeEasterEgg = ({ onBack }: { onBack: () => void }) => {
  const [pos, setPos] = useState({ x: 0, z: 500, rot: 0 });
  const keys = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;
    let currentX = pos.x;
    let currentZ = pos.z;
    let currentRot = pos.rot;

    const loop = () => {
      let moved = false;
      const speed = 25;
      const rotSpeed = 3;

      if (keys.current['a'] || keys.current['arrowleft']) { currentRot += rotSpeed; moved = true; }
      if (keys.current['d'] || keys.current['arrowright']) { currentRot -= rotSpeed; moved = true; }

      if (keys.current['w'] || keys.current['arrowup']) {
         currentZ += Math.cos(currentRot * Math.PI / 180) * speed;
         currentX += Math.sin(currentRot * Math.PI / 180) * speed;
         moved = true;
      }
      if (keys.current['s'] || keys.current['arrowdown']) {
         currentZ -= Math.cos(currentRot * Math.PI / 180) * speed;
         currentX -= Math.sin(currentRot * Math.PI / 180) * speed;
         moved = true;
      }

      if (moved) setPos({ x: currentX, z: currentZ, rot: currentRot });
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-[300000] overflow-hidden" style={{ perspective: '800px' }}>
       {/* 3D scene of a maze */}
       <div className="relative w-full h-full flex justify-center items-center">
         
         <div className="absolute top-10 flex flex-col items-center gap-2 z-50">
             <h1 className="text-white font-bold text-4xl drop-shadow-[0_4px_4px_rgba(255,0,0,0.8)] tracking-widest text-center max-w-2xl bg-black/50 p-4 rounded border-2 border-red-500">WHAT SITES IM TRYING TO BEAT</h1>
             <div className="px-4 py-1 border-2 border-yellow-500 bg-black/80 text-yellow-500 font-bold tracking-widest animate-pulse shadow-[0_0_10px_rgba(255,255,0,0.5)]">USE [W A S D] TO WALK / TURN</div>
         </div>
         
         {/* Maze animation using manual controls */}
         <div className="absolute w-full h-full flex justify-center items-center transition-none" style={{ transformStyle: 'preserve-3d', transform: `translateZ(${pos.z}px) translateX(${pos.x}px) rotateY(${pos.rot}deg)` }}>
           
           {/* Floor and Ceiling */}
           <div className="absolute w-[8000px] h-[8000px] border-t-2 border-red-700 bg-red-900/30" style={{ transform: 'rotateX(90deg) translateZ(-300px)', backgroundImage: 'linear-gradient(rgba(255,0,0,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(255,0,0,0.2) 2px, transparent 2px)', backgroundSize: '100px 100px' }}></div>
           <div className="absolute w-[8000px] h-[8000px] bg-blue-900/10" style={{ transform: 'rotateX(90deg) translateZ(300px)', backgroundImage: 'linear-gradient(rgba(0,100,255,0.2) 2px, transparent 2px), linear-gradient(90deg, rgba(0,100,255,0.2) 2px, transparent 2px)', backgroundSize: '100px 100px' }}></div>
           
           {/* Walls */}
           {/* Target 1: Windows 93 */}
           <div className="absolute w-[500px] h-[500px] bg-brick flex flex-col items-center justify-center p-8 border-4 border-black" style={{ transform: 'translateZ(-800px) rotateY(0deg) translateX(-300px) translateZ(300px)' }}>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Windows_93_logo.svg/1280px-Windows_93_logo.svg.png" className="max-w-full drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] bg-white p-4 rounded-xl mb-4" />
              <div className="bg-red-600 text-white font-black px-4 py-1 uppercase text-2xl tracking-widest border-2 border-white">Main Target</div>
           </div>

           {/* Target 2: Maxo */}
           <div className="absolute w-[500px] h-[500px] bg-brick flex flex-col items-center justify-center p-8 border-4 border-black shadow-[0_0_50px_rgba(0,0,0,0.8)]" style={{ transform: 'translateZ(-1800px) rotateY(90deg) translateX(300px) translateZ(300px)' }}>
              <img src="https://maxo.pt/assets/img/logo.png" className="max-w-full drop-shadow-2xl bg-white p-4 rounded border-4 border-blue-500 mb-4" />
              <div className="bg-blue-600 text-white font-black px-4 py-1 uppercase text-xl shadow-lg border border-black text-center">My dad's company<br/>(Not leaning into this one)</div>
           </div>

           {/* Target 3: Chinese Site (Falling) */}
           <div className="absolute w-[500px] h-[500px] flex flex-col items-center justify-center p-8 animate-fall" style={{ transform: 'translateZ(-2800px) rotateY(-90deg) translateX(-300px) translateZ(300px)' }}>
              <div className="bg-brick w-full h-full absolute border-4 border-black"></div>
              <img src="https://www.fenxm.com/zb_users/upload/2023/09/202309131694577074645672.png" className="relative z-10 max-w-full drop-shadow-2xl bg-white p-4 rounded mb-4" />
              <div className="relative z-10 bg-yellow-500 text-black font-black px-4 py-1 shadow border border-black uppercase text-xl text-center">Sometime it will fall<br/>I don't know when</div>
           </div>

           {/* Target 4: Windows 9 */}
           <div className="absolute w-[600px] h-[600px] bg-brick flex flex-col items-center justify-center p-8 border-4 border-black font-sans" style={{ transform: 'translateZ(-4000px) rotateY(0deg)' }}>
              <h2 className="text-7xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,1)] bg-blue-600 border-4 border-white p-12 text-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">Windows<br/>9</h2>
              <div className="mt-4 bg-yellow-400 text-black font-bold px-4 py-1 text-xl border-2 border-black">FIGHTING MYSELF LOL</div>
           </div>
         </div>
         <button onClick={onBack} className="absolute bottom-10 px-8 py-3 bg-red-600 hover:bg-white hover:text-red-900 border-4 border-white text-white font-bold rounded-full z-50 text-xl transition shadow-[0_0_20px_rgba(255,0,0,0.8)]">BOOT TO OS</button>
       </div>
       <style>{`
         @keyframes fall {
           0% { transform: translateZ(-2800px) rotateY(-90deg) translateX(-300px) translateZ(300px) translateY(0) rotateZ(0deg); opacity: 1; }
           70% { transform: translateZ(-2800px) rotateY(-90deg) translateX(-300px) translateZ(300px) translateY(0) rotateZ(0deg); opacity: 1; }
           100% { transform: translateZ(-2800px) rotateY(-90deg) translateX(-300px) translateZ(300px) translateY(2000px) rotateZ(180deg); opacity: 0; }
         }
         .animate-fall {
            animation: fall 10s ease-in forwards;
         }
         .bg-brick {
           background-color: #555;
           background-image: 
             linear-gradient(335deg, rgba(255,255,255,0.1) 10%, transparent 10%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 60%, transparent 60%, transparent),
             linear-gradient(155deg, rgba(255,255,255,0.1) 10%, transparent 10%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 60%, transparent 60%, transparent);
           background-size: 80px 80px;
         }
       `}</style>
    </div>
  );
};

const StartupScreen = ({ playSound, onComplete, setStartClickCount, startClickCount, setBiosScreenVisible }: any) => {
  const [secondStartCount, setSecondStartCount] = useState(0);
  const [showMaze, setShowMaze] = useState(false);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    playSound('serverboot');
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    setTimerId(timer);
    return () => clearTimeout(timer);
  }, []);

  if (showMaze) {
    return <MazeEasterEgg onBack={onComplete} />;
  }

  return (
    <div className="absolute inset-0 bg-black z-[200000] flex flex-col items-center justify-center">
      <div className="animate-bump">
        <h1 className="text-white text-6xl font-bold font-sans">AICESOS</h1>
      </div>
      <p className="text-white mt-8 font-mono animate-pulse">Loading System...</p>
      
      <div className="flex gap-4">
        <button 
          className="mt-10 px-6 py-2 border-2 border-gray-500 text-gray-500 hover:border-white hover:text-white transition-colors rounded font-mono text-sm"
          onClick={() => {
            const newCount = startClickCount + 1;
            setStartClickCount(newCount);
            if (newCount >= 3) {
              setBiosScreenVisible(true);
              setStartClickCount(0);
            }
            setTimeout(() => setStartClickCount(0), 2000);
          }}
        >
          Start
        </button>

        <button 
          className="mt-10 px-6 py-2 border-none text-gray-800 hover:text-gray-600 transition-colors rounded font-mono text-xs opacity-30 hover:opacity-100"
          onClick={() => {
            const newCount = secondStartCount + 1;
            setSecondStartCount(newCount);
            if (newCount >= 3) {
              if (timerId) clearTimeout(timerId);
              setShowMaze(true);
            }
            setTimeout(() => setSecondStartCount(0), 4000); // giving more time to click
          }}
        >
          Start 2
        </button>
      </div>
      <p className="mt-4 text-xs text-gray-600">Click Start 3 times to enter BIOS setup</p>
    </div>
  );
};

export default function App() {
  const [isRedMode, setIsRedMode] = useState(false);
  const [language, setLanguage] = useState('English');

  const t = (key: string, fallback?: string) => {
    return translations[language]?.[key] || translations['English']?.[key] || fallback || key;
  };

  const [isBooting, setIsBooting] = useState(true);
  const [isOobeComplete, setIsOobeComplete] = useState(() => localStorage.getItem('aicesos_setup_complete') === 'true');
  const [isBlankMode, setIsBlankMode] = useState(false);
  const [bsodForever, setBsodForever] = useState(() => localStorage.getItem('OS_BRICKED') === 'true');
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [isBaldiChallenge, setIsBaldiChallenge] = useState(false);
  const [baldiQuestionCount, setBaldiQuestionCount] = useState(0);
  const [baldiQuestion, setBaldiQuestion] = useState({ q: '', a: 0 });
  const [baldiInput, setBaldiInput] = useState('');
  const [baldiPhase, setBaldiPhase] = useState<'math' | 'bios' | 'puzzle'>('math');
  const [baldiBiosKey, setBaldiBiosKey] = useState('');
  const [baldiBiosInput, setBaldiBiosInput] = useState('');
  const [baldiPuzzlePattern, setBaldiPuzzlePattern] = useState<number[]>([]);
  const [baldiPuzzleInput, setBaldiPuzzleInput] = useState<number[]>([]);
  const [isBricked, setIsBricked] = useState(false); // local state for immediate effect
  const [bootText, setBootText] = useState('');
  const [wifiConnected, setWifiConnected] = useState(false);
  const [biosScreenVisible, setBiosScreenVisible] = useState(false);
  const [biosTab, setBiosTab] = useState('main'); // main, advanced, boot, exit
  const [biosDesign, setBiosDesign] = useState('classic'); // classic, simple, modern
  const [secureBoot, setSecureBoot] = useState(true);
  const [fanSpeed, setFanSpeed] = useState('Auto');
  const [biosOptionValues, setBiosOptionValues] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    BIOS_OPTIONS.forEach(opt => {
      initial[opt.id] = opt.value;
    });
    return initial;
  });
  const [startClickCount, setStartClickCount] = useState(0);
  const [showDebugMenu, setShowDebugMenu] = useState(false);
  const [debugSettings, setDebugSettings] = useState({
    safeMode: false,
    lowQualityImages: false,
    noImages: false,
    noComplexJs: false,
    cssFilter: 'none',
    comicSans: false,
    matrixMode: false,
    rainbowText: false,
    spinDesktop: false,
    bouncyIcons: false,
    hideTaskbar: false,
    glitchMode: false,
    discoMode: false,
    transparentWindows: false,
    wobblyWindows: false
  });

  const [isRetroMode, setIsRetroMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGirlyMode, setIsGirlyMode] = useState(false);
  const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920');
  const [taskbarColor, setTaskbarColor] = useState('rgba(0,0,0,0.5)');
  const [cursorStyle, setCursorStyle] = useState('default');
  const [taskbarPosition, setTaskbarPosition] = useState<'bottom' | 'top' | 'left' | 'right'>('bottom');
  const [showStartButton, setShowStartButton] = useState(true);
  const [pcMode, setPcMode] = useState('default');
  const [windowTransparency, setWindowTransparency] = useState(0.95);
  const [animationSpeed, setAnimationSpeed] = useState(0.3);
  const [systemSound, setSystemSound] = useState(0.5);
  const [userName, setUserName] = useState('Gomer');
  const [userPfp, setUserPfp] = useState('https://files.softicons.com/download/toolbar-icons/fatcow-hosting-extra-icons-2-by-fatcow/png/32x32/user_gomer.png');
  const [loginScreenVisible, setLoginScreenVisible] = useState(true);
  const [launchpadActive, setLaunchpadActive] = useState(false);
  const [activeWindows, setActiveWindows] = useState<Record<string, boolean>>({});
  const [windowInstances, setWindowInstances] = useState<{id: string, appId: string}[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(10);
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>({});
  const [maximizedState, setMaximizedState] = useState<Record<string, any>>({});
  const [windowPositions, setWindowPositions] = useState<Record<string, {x: number, y: number}>>({});
  const [dragging, setDragging] = useState<{id: string, offsetX: number, offsetY: number} | null>(null);
  const [selectionBox, setSelectionBox] = useState<{startX: number, startY: number, endX: number, endY: number, visible: boolean}>({startX: 0, startY: 0, endX: 0, endY: 0, visible: false});
  const [selectedDesktopIcons, setSelectedDesktopIcons] = useState<string[]>([]);
  const [isTaskbarClosed, setIsTaskbarClosed] = useState(false);
  const [mouseStamina, setMouseStamina] = useState(100);
  const mouseDistAcc = useRef(0);
  const lastMouseUpdate = useRef(performance.now());
  const mousePos = useRef({x: 0, y: 0});
  
  const [contextMenu, setContextMenu] = useState<{visible: boolean, x: number, y: number, targetName?: string}>({visible: false, x: 0, y: 0});
  const [currentTime, setCurrentTime] = useState('');
  const [downloadingApps, setDownloadingApps] = useState<Record<string, boolean>>({});
  const [pendingDownload, setPendingDownload] = useState<string | null>(null);
  const [selectedFlashGame, setSelectedFlashGame] = useState<string | null>(null);
  const [selectedNesGame, setSelectedNesGame] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [explorerSearchQuery, setExplorerSearchQuery] = useState('');
  const [desktopSortBy, setDesktopSortBy] = useState<string>('name');
  const [desktopViewSize, setDesktopViewSize] = useState<string>('Medium');
  const [desktopIconPositions, setDesktopIconPositions] = useState<Record<string, {x: number, y: number}>>({});
  const [draggingIcon, setDraggingIcon] = useState<{name: string, offsetX: number, offsetY: number, groupOffsets?: Record<string, {offsetX: number, offsetY: number}>} | null>(null);
  const [showWidgets, setShowWidgets] = useState(true);
  const [activeWidgets, setActiveWidgets] = useState<Record<string, boolean>>({
    clock: true,
    media: true,
    calendar: true,
    photosynth: true,
    yahoo1: true,
    yahoo2: true,
    pepsi: true,
    yahoo3: true
  });
  
  // Device Connection States
  const [deviceCallout, setDeviceCallout] = useState<string | null>(null);
  const [isXboxMode, setIsXboxMode] = useState(false);
  const [isTVMode, setIsTVMode] = useState(false);
  const [headphonesActive, setHeadphonesActive] = useState(false);

  // Easter Egg states
  const [loginClicks, setLoginClicks] = useState(0);
  const [taskbarContextMenu, setTaskbarContextMenu] = useState<{x: number, y: number, id?: string} | null>(null);
  const [clockClicks, setClockClicks] = useState(0);
  const clockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [konamiIndex, setKonamiIndex] = useState(0);
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  const [tadcIndex, setTadcIndex] = useState(0);
  const tadcCode = ['t', 'a', 'd', 'c'];
  const [adultBypassIndex, setAdultBypassIndex] = useState(0);
  const adultBypassCode = ['i', '8', 'd', '1', '2', '3', '4'];
  const [isTadcMode, setIsTadcMode] = useState(false);
  const [isBlackberryMode, setIsBlackberryMode] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ text: '', iconUrl: '', visible: false });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // File Explorer state
  const [currentPath, setCurrentPath] = useState(['C:']);
  const [fsHistory, setFsHistory] = useState<any[]>([]);
  const [fsRedoStack, setFsRedoStack] = useState<any[]>([]);
  const [explorerContextMenu, setExplorerContextMenu] = useState<{ x: number, y: number, path: string[] | null }>({ x: 0, y: 0, path: null });
  const [renamingPath, setRenamingPath] = useState<string[] | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // App Maker state
  const [customAppCount, setCustomAppCount] = useState(0);
  const [amName, setAmName] = useState('My Cool App');
  const [amIcon, setAmIcon] = useState('https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/mimetypes/html.png');
  const [amBg, setAmBg] = useState('#ffffff');
  const [amColor, setAmColor] = useState('#000000');
  const [amFont, setAmFont] = useState('Arial');
  const [amHtml, setAmHtml] = useState(`<h1>Hello World!</h1>\n<p>This app was built natively in ${t('os_name')}.</p>`);

  // Stonemeni Chat state
  const [stoneInput, setStoneInput] = useState('');
  const [stoneMessages, setStoneMessages] = useState([
    { sender: 'bot', text: 'Greetings! I am slightly dumber than Gemini. What is your question?' }
  ]);

  // Error Remix state
  const [errorRemixActive, setErrorRemixActive] = useState(false);
  const [errorRemixPopups, setErrorRemixPopups] = useState<{id: number, x: number, y: number, text: string}[]>([]);
  const [errorRemixVideoVisible, setErrorRemixVideoVisible] = useState(false);
  const [errorRemixBSODVisible, setErrorRemixBSODVisible] = useState(false);
  const [pcRemovalGifVisible, setPcRemovalGifVisible] = useState(false);
  const [grandFinaleActive, setGrandFinaleActive] = useState(false);
  const [grandFinaleStep, setGrandFinaleStep] = useState(0);
  const [errorRemixFlyingIcons, setErrorRemixFlyingIcons] = useState(false);
  const [errorRemixColorful, setErrorRemixColorful] = useState(false);
  const [errorRemixFilter, setErrorRemixFilter] = useState('none');

  // APK Box Buddy state
  const [boxBuddyActive, setBoxBuddyActive] = useState(false);
  const [buddyPos, setBuddyPos] = useState(0);
  const [buddyHasBox, setBuddyHasBox] = useState(true);
  const [fallingBoxes, setFallingBoxes] = useState<{id: number, x: number, y: number, vy: number}[]>([]);
  const [explodedApks, setExplodedApks] = useState<{id: number, x: number, y: number, vx: number, vy: number, rotation: number}[]>([]);
  const [isShaking, setIsShaking] = useState(false);
  const [gravityEnabled, setGravityEnabled] = useState(false);
  const gravityVelocities = useRef<{ windows: Record<string, number>, icons: Record<string, number> }>({ windows: {}, icons: {} });

  const [isOmgActive, setIsOmgActive] = useState(false);
  const [chilledState, setChilledState] = useState(0); // 0: off, 1: flip V, 2: 90deg, 3: split, 4: BSOD, 5: Fake Tab

  // Johnny's Store state
  const [isJohnnysStoreVisible, setIsJohnnysStoreVisible] = useState(false);
  const [hasJohnnyQuarter, setHasJohnnyQuarter] = useState(false);
  const [hasIkeaQuarter, setHasIkeaQuarter] = useState(false);
  const [hasJohnnyScissors, setHasJohnnyScissors] = useState(false);
  const [hasJohnnyGrapplingHook, setHasJohnnyGrapplingHook] = useState(false);
  const [hasJohnnyPhone, setHasJohnnyPhone] = useState(false);
  const [hasJohnnyStudent, setHasJohnnyStudent] = useState(false);
  const [hasJohnnyBsoda, setHasJohnnyBsoda] = useState(false);
  const [hasJohnnyDietBsoda, setHasJohnnyDietBsoda] = useState(false);
  const [hasJohnnyGum, setHasJohnnyGum] = useState(false);
  const [hasJohnnyHandgun, setHasJohnnyHandgun] = useState(false);
  const [hasJohnnyRuler, setHasJohnnyRuler] = useState(false);
  
  const [isScissorsActive, setIsScissorsActive] = useState(false);
  const [isHandgunActive, setIsHandgunActive] = useState(false);
  const [blankedIcons, setBlankedIcons] = useState<Set<string>>(new Set());

  // Themes state
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>([]);
  const [activeCustomTheme, setActiveCustomTheme] = useState<string | null>(null);

  // Apps Database
  const [apps, setApps] = useState<Record<string, any>>({
    'cryforme': { name: 'Cry For Me', icon: 'https://media.tenor.com/ry7vDwNkJs0AAAAM/spongebob-ascend.gif', isDownloaded: true, desc: 'I want you crying for me' },
    'dobles': { name: 'Dobles Secret', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', isDownloaded: true, desc: 'Dobles Secret Inputs', iframeUrl: '/dobles.html' },
    'win9': { name: 'Windows 9', icon: 'https://www.clipartmax.com/png/middle/8-82098_ms-windows-clipart-transparent-windows-7-icon-png.png', isDownloaded: true, desc: 'The Infinite App Edition.' },
    'macstars': { name: 'Mac Stars', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', isDownloaded: true, desc: 'Trap.' },
    'vmware': { name: 'VMware', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vmware.svg/1200px-Vmware.svg.png', isDownloaded: true, desc: 'Virtualization software.' },
    'omg': { name: 'omg', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', isDownloaded: true, desc: 'CRITICAL SYSTEM FILE' },
    'chilled_windows': { name: 'CHILLED windows', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', isDownloaded: true, desc: 'Do not run.' },
    'roblox': { name: 'Roblox', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png', isDownloaded: true, desc: 'Play millions of 3D experiences.' },
    'cookiesoap': { name: 'Cookie Soap', icon: 'https://files.softicons.com/download/system-icons/oxygen-icons-by-oxygen/png/48x48/apps/preferences_web_browser_cookies.png', isDownloaded: true, desc: 'Famous filter that reads your face.' },
    'dolphin': { name: 'Dolphin', icon: 'https://i.imgflip.com/49bn70.jpg', isDownloaded: true, desc: 'Enables gravity!' },
    'videoplayer': { name: 'Video Player', icon: 'https://files.softicons.com/download/system-icons/itunes-filetype-icons-by-thiago-silva/png/48x48/iTunes-movie-blue.png', isDownloaded: true, desc: 'Play your favorite videos.' },
    'about_os': { name: 'About Web AICESOS', icon: 'https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/32x32/actions/help-about.png', isDownloaded: true, desc: 'Learn about Web AICESOS and its secrets.' },
    'aboutme': { name: 'About Me', icon: 'https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/48/Retro%20Block%20-%20Question.png', isDownloaded: true, desc: 'Darius personal bio.' },
    'appmaker': { name: 'App Maker', icon: 'https://files.softicons.com/download/toolbar-icons/fatcow-hosting-icons-by-fatcow/png/32/color_swatch.png', isDownloaded: true, desc: 'Create and publish custom apps.' },
    'youtube': { name: 'YouTube', icon: 'https://files.softicons.com/download/iphone-icons/zosha-icon-pack-by-craig-philips/png/60x61/YouTube.png', isDownloaded: true, desc: 'Watch videos and Misses Pomp classes.' },
    'chrome': { name: 'Chrome Store', icon: 'https://files.softicons.com/download/android-icons/lipse-icons-by-vanessaem/png/128x128/gsearch.png', isDownloaded: false, desc: 'Download apps directly to your desktop.' },
    'stonemeni': { name: 'Stonemeni AI', icon: 'https://files.softicons.com/download/object-icons/eco-health-icons-by-archigraphs/png/48/IslandStone_Archigraphs.png', isDownloaded: true, desc: 'Your rock-brained AI assistant.' },
    'claude': { name: 'Claude', icon: 'https://media.licdn.com/dms/image/v2/D4E0BAQFko-zWIZk_pw/company-logo_200_200/B4EZhiRWKvHgAI-/0/1753995371543/claude_logo?e=2147483647&v=beta&t=CVNmFKyWig0Uo78oAr3II6KVLu_o0aXPtnt4S6XgOr8', isDownloaded: false, desc: 'The most pussy AI in the world.' },
    'settings': { name: 'Settings', icon: 'https://files.softicons.com/download/iphone-icons/indigo-icons-by-mihaiciuc-bogdan/png/55x55/Settings.png', isDownloaded: true, desc: 'System settings.' },
    'theme_store': { name: 'Theme Store', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kcontrol.png', isDownloaded: true, desc: 'Buy themes for your PC.' },
    'cydia': { name: 'Cydia', icon: 'https://files.softicons.com/download/system-icons/epitome-icons-by-craig-philips/png/59x60/Cydia.png', isDownloaded: false, desc: 'Jailbreak your Web AICESOS.' },
    'cydia_fake': { name: 'Free Cydia', icon: 'https://files.softicons.com/download/system-icons/epitome-icons-by-craig-philips/png/59x60/Cydia.png', isDownloaded: false, desc: 'Totally legit.' },
    'hydra': { name: 'hydra.exe', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', isDownloaded: false, desc: 'Do not run this.' },
    'doge_unlocked': { name: 'DOGE UNLOCKED', icon: 'https://pbs.twimg.com/profile_images/1324572434314526721/AP1plNDx_400x400.jpg', isDownloaded: false, desc: 'VIRUS WARNING' },
    'talking_horror': { name: 'My Talking Horor', icon: 'https://static.wikia.nocookie.net/talking-tom-and-friends-fanon/images/e/e4/My_Horror_2.jpeg/revision/latest?cb=20250728040333', isDownloaded: false, desc: 'He watches.' },
    'mspomp_update': { name: 'Ms. Pomp Update', icon: 'https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/32x32/emotes/face-smile.png', isDownloaded: true, desc: 'Ms. Pomp' },
    'pc': { name: 'PC', icon: 'https://files.softicons.com/download/object-icons/mac-icons-by-iconshock/png/128/imac.png', isDownloaded: true, desc: 'Browse your computer files.' },
    'bouncyball': { name: 'Bouncy Ball', icon: 'https://files.softicons.com/download/system-icons/project-icons-by-bogo-d/png/32/Color%20Wheel.png', isDownloaded: false, desc: 'Simple ball physics game.' },
    'balloon': { name: 'Protect Balloon', icon: 'https://files.softicons.com/download/toolbar-icons/fatcow-hosting-icons-by-fatcow/png/32/baloon.png', isDownloaded: false, desc: 'Dodge the falling spikes!' },
    'flappy': { name: 'Flappy Bird', icon: 'https://img.itch.zone/aW1nLzIwNTA5MzAyLnBuZw==/original/YDV4t2.png', isDownloaded: false, desc: 'Flap through the pipes.' },
    'angrybirds': { name: 'Angry Birds', icon: 'https://files.softicons.com/download/iphone-icons/zosha-icon-pack-by-craig-philips/png/60x61/AngryBirds.png', isDownloaded: false, desc: 'Premium bird slinging action.', price: '$99.99' },
    'textdocs': { name: 'Text docs', icon: 'https://files.softicons.com/download/object-icons/pirate-icons-by-pinchodesigns/png/128x128/Text_Pirate.png', isDownloaded: false, desc: 'Write notes and save documents.' },
    'flashplayer': { name: 'Flash Player', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', isDownloaded: true, desc: 'Play classic Flash games.' },
    'sysmon': { name: 'System Monitor', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kdf.png', isDownloaded: true, desc: 'View system resources.' },
    'gchat': { name: 'Google Chat', icon: 'https://files.softicons.com/download/application-icons/circle-icons-add-on-2-by-martz90/png/48x48/google%20hangouts.png', isDownloaded: true, desc: 'Chat with friends.' },
    'imageviewer': { name: 'Image Viewer', icon: 'https://files.softicons.com/download/system-icons/oxygen-icons-by-oxygen/png/48x48/mimetypes/image_x_dds.png', isDownloaded: true, desc: 'View images.' },
    /* 'videoeditor': { name: 'Video Editor', icon: 'https://files.softicons.com/download/system-icons/itunes-filetype-icons-by-thiago-silva/png/48x48/iTunes-movie-blue.png', isDownloaded: true, desc: 'Edit and export videos to MP4.' }, */
    'browser': { name: 'Browser', icon: 'https://files.softicons.com/download/application-icons/gloss-browser-icons-by-phoenix-pyre/png/128x128/ie.png', isDownloaded: true, desc: 'Surf the web.' },
    'bowser': { name: 'Bowser', icon: 'https://files.softicons.com/download/game-icons/super-mario-icons-by-sandro-pereira/png/48/Paper%20Bowser.png', isDownloaded: true, desc: 'A browser that invents sites.' },
    'mspomp': { name: 'Ms. Pomp', icon: 'https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/32x32/emotes/face-smile.png', isDownloaded: false, desc: 'Your helpful assistant Ms. Pomp.' },
    'w3shit': { name: 'w3SHIT', icon: 'https://files.softicons.com/download/system-icons/tha-icon-by-tha-phlash/png/72x72/misc_w3.png', isDownloaded: false, desc: 'Create, see, and save HTML.' },
    'paint': { name: 'Paint', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kpaint.png', isDownloaded: true, desc: 'Wallpaper creator.' },
    'calculator': { name: 'Calculator', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/calc.png', isDownloaded: true, desc: 'Perform basic calculations.' },
    'calendar': { name: 'Calendar', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/date.png', isDownloaded: true, desc: 'View dates and schedule.' },
    'terminal': { name: 'Terminal', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/terminal.png', isDownloaded: true, desc: 'Command line interface.' },
    'stickynotes': { name: 'Sticky Notes', icon: 'https://files.softicons.com/download/toolbar-icons/fatcow-hosting-icons-by-fatcow/png/32/note.png', isDownloaded: true, desc: 'Quick notes on your desktop.' },
    'musicplayer': { name: 'Music Player', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/amarok.png', isDownloaded: true, desc: 'Listen to your favorite tunes.' },
    'weather': { name: 'Weather', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/weather.png', isDownloaded: true, desc: 'Check the local forecast.' },
    'recyclebin': { name: 'Recycle Bin', icon: 'https://files.softicons.com/download/system-icons/windows-8-metro-icons-by-dakirby309/png/128x128/Folders%20&%20OS/Recycle%20Bin%20Empty.png', isDownloaded: true, desc: 'Your Windows 11 Recycle Bin.' },
    'taskmanager': { name: 'Task Manager', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kdf.png', isDownloaded: true, desc: 'Manage running processes.' },
    'word': { name: 'Word', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/docx_win.png', isDownloaded: true, desc: 'Create and edit documents.' },
    'excel': { name: 'Excel', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/xlsx_win.png', isDownloaded: true, desc: 'Create and edit spreadsheets.' },
    'powerpoint': { name: 'PowerPoint', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/pptx_win.png', isDownloaded: false, desc: 'Create and edit presentations.' },
    'docs': { name: 'Docs', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/docx_win.png', isDownloaded: true, desc: 'Cloud-based document editor.' },
    'slides': { name: 'Slides', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/pptx_win.png', isDownloaded: true, desc: 'Cloud-based presentation editor.' },
    'error_remix': { name: 'Error Remix', icon: 'https://www.mindvideo.ai/_next/image/?url=%2Fimages%2Fgenerate-video%2Fvideo_failure.webp&w=256&q=75', isDownloaded: true, desc: 'A chaotic error experience.' },
    'boxbuddy': { name: 'APK Box Buddy', icon: 'https://pentestlab.blog/wp-content/uploads/2017/01/apk-download1.png', isDownloaded: true, desc: 'Your helpful Android friend.' },
    'nesplayer': { name: 'NES Player', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', isDownloaded: true, desc: 'Play classic NES games.' },
    'winxphorror': { name: 'Windows XP Horror Edition', icon: 'https://files.softicons.com/download/toolbar-icons/free-red-button-icons-by-aha-soft/png/48x48/hard%20disk.png', isDownloaded: true, desc: 'A spooky version of Windows XP.' },
    'wine': { name: 'Wine', icon: 'https://files.softicons.com/download/system-icons/oxygen-icons-by-oxygen/png/48x48/apps/wine_doors.png', isDownloaded: true, desc: 'Install Windows programs on Linux/WebUx.' },
    'utorrent': { name: 'uTorrent', icon: 'https://files.softicons.com/download/application-icons/round-app-icons-by-ampeross/png/48x48/uTorrent.png', isDownloaded: false, desc: 'BitTorrent client (cannot install).' },
    '000': { name: '000.exe', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', isDownloaded: false, desc: 'CRITICAL SYSTEM FILE' },
    'steam': { name: 'Steam', icon: 'https://files.softicons.com/download/application-icons/circle-icons-by-martz90/png/128x128/steam.png', isDownloaded: false, desc: 'The ultimate gaming platform.' },
    'outlook': { name: 'Outlook 2010', icon: 'https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/outlook_win.png', isDownloaded: false, desc: 'Email and calendar client.' },
    'eve': { name: 'Eve Online', icon: 'https://files.softicons.com/download/game-icons/eve-online-icons-by-eve-online/png/128x128/eve_online.png', isDownloaded: false, desc: 'Massive multiplayer space epic.' },
    'photoshop': { name: 'Photoshop CC 2015', icon: 'https://files.softicons.com/download/adobe-icons/adobe-creative-suite-6-icons-by-dakirby309/png/128x128/Adobe%20Photoshop%20CS6.png', isDownloaded: false, desc: 'Professional image editing.' },
    'fallout': { name: 'Fallout NV', icon: 'https://files.softicons.com/download/game-icons/fallout-3-icons-by-iconshock/png/128x128/fallout_3.png', isDownloaded: false, desc: 'Post-apocalyptic RPG.' },
    'reason': { name: 'Reason', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/krec.png', isDownloaded: false, desc: 'Music production studio.' },
    'skyrim': { name: 'Skyrim Special Ed', icon: 'https://files.softicons.com/download/game-icons/skyrim-icons-by-iconshock/png/128x128/skyrim.png', isDownloaded: false, desc: 'Epic fantasy open world.' },
    'gog': { name: 'GOG Galaxy', icon: 'https://files.softicons.com/download/application-icons/circle-icons-by-martz90/png/128x128/gog.png', isDownloaded: false, desc: 'DRM-free game library.' },
    'wizard101': { name: 'Wizard101', icon: 'https://files.softicons.com/download/game-icons/wizard101-icons-by-kingsisle-entertainment/png/128x128/wizard101.png', isDownloaded: false, desc: 'Magical adventure game.' },
    'matlab': { name: 'Matlab', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/calc.png', isDownloaded: false, desc: 'Numerical computing environment.' },
    'sims3': { name: 'Sims 3', icon: 'https://files.softicons.com/download/game-icons/the-sims-3-icons-by-electronic-arts/png/128x128/the_sims_3.png', isDownloaded: false, desc: 'Life simulation game.' },
    'metatrader': { name: 'MetaTrader 5', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kchart.png', isDownloaded: false, desc: 'Trading platform for financial markets.' }
  });

  // File System
  const folderIcon = "https://files.softicons.com/download/folder-icons/se-folder-icons-by-e-young/png/48x48/windows.png";
  const docxIcon = "https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/docx_win.png";
  const pptxIcon = "https://files.softicons.com/download/system-icons/file-types-icons-by-treetog-artwork/png/48x48/pptx_win.png";
  const pngIcon = "https://files.softicons.com/download/system-icons/file-extension-icons-by-design-bolts/png/48x48/PNG%20File%20Extension.png";
  const htmlIcon = "https://files.softicons.com/download/system-icons/file-extension-icons-by-design-bolts/png/48x48/HTML%20File%20Extension.png";
  const gifIcon = "https://files.softicons.com/download/system-icons/file-extension-icons-by-design-bolts/png/48x48/GIF%20File%20Extension.png";
  const mp4Icon = "https://files.softicons.com/download/system-icons/file-extension-icons-by-design-bolts/png/48x48/MP4%20File%20Extension.png";
  const mp3Icon = "https://files.softicons.com/download/system-icons/file-extension-icons-by-design-bolts/png/48x48/MP3%20File%20Extension.png";
  const textIcon = "https://files.softicons.com/download/object-icons/pirate-icons-by-pinchodesigns/png/128x128/Text_Pirate.png";
  
  const [fileSystem, setFileSystem] = useState<Record<string, any>>({
    'C:': { type: 'folder', contents: {
        'Users': { type: 'folder', contents: {
            'Gomer': { type: 'folder', contents: {
                'Desktop': { type: 'folder', contents: {
                    'Cry For Me.exe': { type: 'file', icon: 'https://media.tenor.com/ry7vDwNkJs0AAAAM/spongebob-ascend.gif', app: 'cryforme' },
                    'Dobles Secret.exe': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'dobles' },
                    'Windows 9.exe': { type: 'file', icon: 'https://www.clipartmax.com/png/middle/8-82098_ms-windows-clipart-transparent-windows-7-icon-png.png', app: 'win9' },
                    'Mac Stars.exe': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', app: 'macstars' },
                    'VMware.exe': { type: 'file', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Vmware.svg/1200px-Vmware.svg.png', app: 'vmware' },
                    '000.exe': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', app: '000' },
                    'omg.exe': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', app: 'omg' },
                    'CHILLED windows.exe': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/bug.png', app: 'chilled_windows' }
                } }, 
                'Documents': { type: 'folder', contents: {
                    'secret_passwords.txt': { type: 'file', icon: textIcon, app: 'textdocs' },
                    'diary.txt': { type: 'file', icon: textIcon, app: 'textdocs' },
                    'resume.docx': { type: 'file', icon: docxIcon, app: 'textdocs' },
                    'presentation.pptx': { type: 'file', icon: pptxIcon, app: 'textdocs' },
                    'ops.png': { type: 'file', icon: 'https://files.softicons.com/download/web-icons/popo-emoticons-by-rokey/png/48/ops.png', app: 'imageviewer', content: 'https://files.softicons.com/download/web-icons/popo-emoticons-by-rokey/png/48/ops.png' }
                }},
                'Videos': { type: 'folder', contents: {
                    'my_video.mp4': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/itunes-filetype-icons-by-thiago-silva/png/48x48/iTunes-movie-blue.png', app: 'videoplayer', content: 'https://1drv.ms/v/c/94c57c2eb47b51f8/IQAkfgCpPiQMRIhbsbIGOY_MAQ_No_LcQN_ousmLLwygV2Y?e=aeoTgC' },
                    'Video Project 38.mp4': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/itunes-filetype-icons-by-thiago-silva/png/48x48/iTunes-movie-blue.png', app: 'videoplayer', content: 'https://archive.org/embed/video-project-38' },
                    'YouTube Rewind 2018.mp4': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/itunes-filetype-icons-by-thiago-silva/png/48x48/iTunes-movie-blue.png', app: 'videoplayer', content: 'https://archive.org/embed/you-tube-rewind-2018' }
                }}
            }}
        }},
        'Windows': { type: 'folder', contents: { 'System32': { type: 'folder', contents: {} } } },
        'Windows 11': { type: 'folder', contents: {} }
    }},
    'D:': { type: 'folder', contents: { 
        'Games': { type: 'folder', contents: {
            'Water Sons.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'tawog-water-sons' },
            'Donkey Dash.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'gumball-donkey-dash_202409' },
            'Blind Fooled.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'blind-fooled_202408' },
            'Cannon Bird 3.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'cannon-bird-3' },
            'Rifleman Mario.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'rifleman-mario' },
            'Super Mario 63.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'super-mario-63' },
            'Fancy Pants.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'fancy-pants-adventure-world-1' },
            'Bloons TDR 4.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'bloons-tower-defense-4' },
            'Age of War.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'age-of-war' },
            'Impossible Quiz.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'the-impossible-quiz' },
            'Run 3.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'run-3' },
            'Duck Life 4.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'duck-life-4' },
            'Super Mario Flash.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'super-mario-flash' },
            'Sonic Flash.swf': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'flashplayer', content: 'sonic-flash' },
            'Donkey Kong Classics.nes': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'nesplayer', content: 'donkey-kong-classics_202502' },
            'My NES Collection.nes': { type: 'file', icon: 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/kasteroids.png', app: 'nesplayer', content: 'my-nes-collection_202408' }
        } } 
    } }
  });

  useEffect(() => {
    const rbContents = fileSystem['C:']?.contents?.['Windows 11']?.contents || {};
    const isEmpty = Object.keys(rbContents).length === 0;
    const icon = isEmpty 
      ? 'https://files.softicons.com/download/system-icons/windows-8-metro-icons-by-dakirby309/png/128x128/Folders%20&%20OS/Recycle%20Bin%20Empty.png'
      : 'https://files.softicons.com/download/system-icons/windows-8-metro-icons-by-dakirby309/png/128x128/Folders%20&%20OS/Recycle%20Bin%20Full.png';
    
    if (apps['recyclebin'].icon !== icon) {
      setApps(prev => ({
        ...prev,
        'recyclebin': { ...prev['recyclebin'], icon }
      }));
    }
  }, [fileSystem, apps, setApps]);

  // --- Effects ---

  useEffect(() => {
    if (!isBooting) {
      if (!biosScreenVisible) playSound('startup');
      return;
    }
    if (biosScreenVisible) return; // Pause boot sequence while in BIOS

    const texts = [
      "Initializing system kernel...",
      "Loading drivers...",
      "Mounting file systems...",
      "Starting UI services...",
      "Welcome."
    ];
    let i = 0;
    const interval = setInterval(() => {
      setBootText(texts[i]);
      i++;
      if (i >= texts.length) {
        clearInterval(interval);
        // setTimeout(() => setIsBooting(false), 1000);
      }
    }, 600);
    return () => clearInterval(interval);
  }, [isBooting, biosScreenVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'F8') {
        e.preventDefault();
        setShowDebugMenu(prev => !prev);
      }
      if (e.ctrlKey && e.key === 'F4') {
        e.preventDefault();
        setIsBlankMode(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isBooting]);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      let h = d.getHours() % 12 || 12;
      let m = d.getMinutes();
      const timeStr = `${h}:${m < 10 ? '0' + m : m} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
      const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      setCurrentTime(`${timeStr} | ${dateStr}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Konami Code
      if (e.key === konamiCode[konamiIndex] || e.key.toLowerCase() === konamiCode[konamiIndex]) {
        if (konamiIndex + 1 === konamiCode.length) {
          if (!apps['doge']) {
            setApps(prev => ({
              ...prev,
              'doge': { name: 'Doge', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv-lY5cLcjqii8NSgwQe5cgDx5JANXYbFUnA&s', isDownloaded: true, desc: 'Very wow.' }
            }));
            showNotification("KONAMI CODE ACTIVATED!", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv-lY5cLcjqii8NSgwQe5cgDx5JANXYbFUnA&s");
          }
          setKonamiIndex(0);
        } else {
          setKonamiIndex(prev => prev + 1);
        }
      } else {
        setKonamiIndex(0);
      }

      // TADC Code
      if (e.key.toLowerCase() === tadcCode[tadcIndex]) {
        if (tadcIndex + 1 === tadcCode.length) {
          setIsTadcMode(prev => !prev);
          setTadcIndex(0);
        } else {
          setTadcIndex(prev => prev + 1);
        }
      } else {
        setTadcIndex(0);
      }

      // Adult Bypass Code: I8D1234
      const keyLow = e.key.toLowerCase();
      if (keyLow === adultBypassCode[adultBypassIndex]) {
        if (adultBypassIndex + 1 === adultBypassCode.length) {
          if (isKidsMode || isBaldiChallenge) {
            setIsKidsMode(false);
            setIsBaldiChallenge(false);
            showNotification("ADULT OVERRIDE SUCCESSFUL", "https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/32x32/actions/lock.png");
          }
          setAdultBypassIndex(0);
        } else {
          setAdultBypassIndex(prev => prev + 1);
        }
      } else {
        setAdultBypassIndex(0);
      }

      // Grand Finale: Ctrl+F3
      if (e.ctrlKey && e.key === 'F3') {
        e.preventDefault();
        setGrandFinaleActive(true);
        setGrandFinaleStep(1);
        playSound('notification');
        setTimeout(() => setGrandFinaleStep(2), 3000);
        setTimeout(() => setGrandFinaleStep(3), 7000);
      }

      // Kids Mode: Ctrl+F5
      if (e.ctrlKey && e.key === 'F5') {
        e.preventDefault();
        if (!isKidsMode) {
          setIsKidsMode(true);
          showNotification("KIDS MODE ACTIVATED! Stay safe!", "https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/32x32/emotes/face-smile.png");
        } else {
          // Trigger Baldi if they try to turn it off
          startBaldiChallenge();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex, tadcIndex, adultBypassIndex, apps, isKidsMode, isBaldiChallenge]);

  useEffect(() => {
    syncDesktopToExplorer();
  }, [apps]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = now - lastMouseUpdate.current;
      if (dt > 16) {
        const dx = e.clientX - mousePos.current.x;
        const dy = e.clientY - mousePos.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        
        if (speed > 1.2) {
          setMouseStamina(prev => Math.max(0, prev - speed * 1.5));
        }
        lastMouseUpdate.current = now;
        mousePos.current = { x: e.clientX, y: e.clientY };
      }

      if (dragging) {
        gravityVelocities.current.windows[dragging.id] = 0;
        setWindowPositions(prev => ({
          ...prev,
          [dragging.id]: {
            x: e.clientX - dragging.offsetX,
            y: Math.max(0, e.clientY - dragging.offsetY)
          }
        }));
      } else if (draggingIcon) {
        gravityVelocities.current.icons[draggingIcon.name] = 0;
        
        setDesktopIconPositions(prev => {
          const next = { ...prev };
          if (draggingIcon.groupOffsets) {
            Object.entries(draggingIcon.groupOffsets).forEach(([name, offset]: [string, any]) => {
              gravityVelocities.current.icons[name] = 0;
              next[name] = {
                x: e.clientX - offset.offsetX,
                y: e.clientY - offset.offsetY
              };
            });
          } else {
            next[draggingIcon.name] = {
              x: e.clientX - draggingIcon.offsetX,
              y: e.clientY - draggingIcon.offsetY
            };
          }
          return next;
        });

      } else if (selectionBox.visible) {
        setSelectionBox(prev => ({ ...prev, endX: e.clientX, endY: e.clientY }));
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      if (draggingIcon) {
        // Check for drop onto folder
        const desktopPath = ['C:', 'Users', 'Gomer', 'Desktop'];
        const desktopFolder = getFolderFromPath(desktopPath);
        const items = desktopFolder?.contents ? Object.entries(desktopFolder.contents) : [];
        
        let droppedInFolder = null;
        
        items.forEach(([name, item]: [string, any], index) => {
          if (name === draggingIcon.name) return;
          if (item.type !== 'folder') return;
          
          const pos = desktopIconPositions[name] || { x: 20 + Math.floor(index / 8) * 100, y: 20 + (index % 8) * 100 };
          const rect = { left: pos.x, top: pos.y, right: pos.x + 80, bottom: pos.y + 80 };
          
          if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
            droppedInFolder = name;
          }
        });
        
        if (droppedInFolder) {
          moveItemToFolder(draggingIcon.name, droppedInFolder);
        }
      }

      setDragging(null);
      setDraggingIcon(null);
      if (selectionBox.visible) {
        const desktopPath = ['C:', 'Users', 'Gomer', 'Desktop'];
        const desktopFolder = getFolderFromPath(desktopPath);
        const items = desktopFolder?.contents ? Object.entries(desktopFolder.contents) : [];
        
        const left = Math.min(selectionBox.startX, selectionBox.endX);
        const top = Math.min(selectionBox.startY, selectionBox.endY);
        const right = Math.max(selectionBox.startX, selectionBox.endX);
        const bottom = Math.max(selectionBox.startY, selectionBox.endY);

        const newSelected = items
          .filter(([name, item]: [string, any], index) => {
            if (isKidsMode && item.type !== 'folder' && item.app && !isKidFriendly(item.app)) return false;
            const pos = desktopIconPositions[name] || { x: 20 + Math.floor(index / 8) * 100, y: 20 + (index % 8) * 100 };
            const iconLeft = pos.x;
            const iconRight = pos.x + 80;
            const iconTop = pos.y;
            const iconBottom = pos.y + 80;
            
            return !(left > iconRight || right < iconLeft || top > iconBottom || bottom < iconTop);
          })
          .map(([name]) => name);

        setSelectedDesktopIcons(newSelected);
        setSelectionBox(prev => ({ ...prev, visible: false }));
      } else if (!draggingIcon && !e.shiftKey && !e.ctrlKey) {
        /* Optional: Do not clear if we are starting a selection */
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Clear selection array if clicking on empty desktop space directly
      if ((e.target as HTMLElement).id === 'desktop') {
        setSelectedDesktopIcons([]);
      }
      if (contextMenu.visible) setContextMenu({ visible: false, x: 0, y: 0 });
      if (taskbarContextMenu) setTaskbarContextMenu(null);
      if (explorerContextMenu.path) setExplorerContextMenu({ x: 0, y: 0, path: null });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('click', handleClick);
    };
  }, [dragging, draggingIcon, selectionBox.visible, contextMenu.visible, taskbarContextMenu, explorerContextMenu.path]);

  // --- Gravity Effect ---
  useEffect(() => {
    const staminaRegen = setInterval(() => {
      setMouseStamina(prev => Math.min(100, prev + 2));
    }, 50);
    return () => clearInterval(staminaRegen);
  }, []);

  useEffect(() => {
    if (!gravityEnabled) return;

    let animationId: number;
    const gravity = 0.5;
    const bounce = -0.6;
    const groundY = window.innerHeight - 50; // Taskbar height

    const updatePhysics = () => {
      setWindowPositions(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(activeWindows).forEach(id => {
          if (activeWindows[id] && !maximizedState[id] && dragging?.id !== id) {
            const pos = next[id] || { x: 100, y: 100 };
            let vy = gravityVelocities.current.windows[id] || 0;
            vy += gravity;
            let newY = pos.y + vy;
            
            // Assume window height is around 400 for bouncing, or just bounce at bottom
            const windowHeight = document.getElementById(id)?.offsetHeight || 400;
            if (newY + windowHeight > groundY) {
              newY = groundY - windowHeight;
              vy *= bounce;
              if (Math.abs(vy) < 1) vy = 0;
            }
            
            if (newY !== pos.y) {
              next[id] = { ...pos, y: newY };
              gravityVelocities.current.windows[id] = vy;
              changed = true;
            }
          }
        });
        return changed ? next : prev;
      });

      setDesktopIconPositions(prev => {
        const next = { ...prev };
        let changed = false;
        Object.keys(apps).filter(name => apps[name].isDownloaded).forEach((name, index) => {
          if (draggingIcon?.name !== name) {
            const pos = next[name] || { x: 20 + Math.floor(index / 8) * 100, y: 20 + (index % 8) * 100 };
            let vy = gravityVelocities.current.icons[name] || 0;
            vy += gravity;
            let newY = pos.y + vy;
            
            const iconHeight = 80;
            if (newY + iconHeight > groundY) {
              newY = groundY - iconHeight;
              vy *= bounce;
              if (Math.abs(vy) < 1) vy = 0;
            }
            
            if (newY !== pos.y) {
              next[name] = { ...pos, y: newY };
              gravityVelocities.current.icons[name] = vy;
              changed = true;
            }
          }
        });
        return changed ? next : prev;
      });

      animationId = requestAnimationFrame(updatePhysics);
    };

    animationId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationId);
  }, [gravityEnabled, activeWindows, maximizedState, dragging, draggingIcon, apps]);

  // --- Helper Functions ---

  const playSound = (type: 'click' | 'error' | 'startup' | 'notification' | 'uninstall' | 'ding' | 'boing' | 'serverboot') => {
    const sounds = {
      click: 'https://actions.google.com/sounds/v1/ui/button_click.ogg',
      error: 'https://actions.google.com/sounds/v1/alarms/beep_short.ogg',
      startup: 'https://actions.google.com/sounds/v1/science_fiction/sci_fi_computer_startup.ogg',
      notification: 'https://actions.google.com/sounds/v1/alarms/positive_notification.ogg',
      uninstall: 'https://actions.google.com/sounds/v1/water/water_drop.ogg',
      ding: 'https://www.myinstants.com/media/sounds/windows-xp-ding.mp3',
      boing: 'https://www.myinstants.com/media/sounds/boing_2.mp3',
      serverboot: 'https://www.myinstants.com/media/sounds/windows-server-2003-startup.mp3'
    };
    const audio = new Audio(sounds[type]);
    audio.volume = systemSound;
    audio.play().catch(() => {});
  };

  const showNotification = (text: string, iconUrl = 'https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/error.png') => {
    playSound('notification');
    setNotification({ text, iconUrl, visible: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, visible: false }));
    }, 4000);

    // Sync to real PC
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(t('os_name'), { body: text, icon: iconUrl });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(t('os_name'), { body: text, icon: iconUrl });
          }
        });
      }
    }
  };

  const startErrorRemix = () => {
    setErrorRemixActive(true);
    setLoginScreenVisible(true);
  };

  useEffect(() => {
    if (!errorRemixActive) return;

    let filterInterval: any;
    let popupInterval: any;

    const sequence = async () => {
      // 0:01 - 0:06: pc logs in on its own
      await new Promise(r => setTimeout(r, 1000));
      setLoginScreenVisible(false);
      
      // 0:06 - 0:08: 17 popups
      await new Promise(r => setTimeout(r, 5000));
      for (let i = 0; i < 17; i++) {
        setErrorRemixPopups(prev => [...prev, {
          id: i,
          x: Math.random() * (window.innerWidth - 300),
          y: Math.random() * (window.innerHeight - 200),
          text: `${t('os_name')} was not installed correctly! Please i beg u to reeinstall ${t('os_name')} (Error 0)`
        }]);
        playSound('error');
        await new Promise(r => setTimeout(r, 100));
      }

      // 0:08 - 0:12: more errors
      await new Promise(r => setTimeout(r, 2000));
      for (let i = 17; i < 30; i++) {
        setErrorRemixPopups(prev => [...prev, {
          id: i,
          x: Math.random() * (window.innerWidth - 300),
          y: Math.random() * (window.innerHeight - 200),
          text: `Critical Error ${i} - System Overload!`
        }]);
        playSound('error');
        await new Promise(r => setTimeout(r, 100));
      }

      // 0:12: errors get clear and a error jumps on the taskbar
      await new Promise(r => setTimeout(r, 2000));
      setErrorRemixPopups([]);
      showNotification("SYSTEM ERROR", "https://www.mindvideo.ai/_next/image/?url=%2Fimages%2Fgenerate-video%2Fvideo_failure.webp&w=256&q=75");

      // 0:30-0:42: icons fly and goes to a random pixbay video in fullscreen
      await new Promise(r => setTimeout(r, 18000));
      setErrorRemixFlyingIcons(true);
      await new Promise(r => setTimeout(r, 5000));
      setErrorRemixVideoVisible(true);

      // 0:42-0:46: bsod
      await new Promise(r => setTimeout(r, 7000));
      setErrorRemixVideoVisible(false);
      setErrorRemixBSODVisible(true);

      // 0:46-0:53: angrybirds and doge error fly accros the colorful bsod
      await new Promise(r => setTimeout(r, 4000));
      setErrorRemixColorful(true);

      // 0:53 to 1:06-1:07: logs off by itself
      await new Promise(r => setTimeout(r, 7000));
      setErrorRemixBSODVisible(false);
      setErrorRemixColorful(false);
      setErrorRemixFlyingIcons(false);
      setLoginScreenVisible(true);

      // 1:07-1:08: logs in 3 times (pirate mode)
      await new Promise(r => setTimeout(r, 14000));
      setLoginScreenVisible(false);
      setIsRetroMode(true);
      for(let i=0; i<3; i++) {
        setLoginScreenVisible(true);
        await new Promise(r => setTimeout(r, 200));
        setLoginScreenVisible(false);
        await new Promise(r => setTimeout(r, 200));
      }
      setLoginScreenVisible(false);

      // 1:09-1:42: Errors, icons, airplanes, angrybirds, gomers, doges, shows the pixbay video again in fullscreen, everything is colorful and css filter changes every second
      setErrorRemixFlyingIcons(true);
      setErrorRemixVideoVisible(true);
      setErrorRemixColorful(true);
      
      filterInterval = setInterval(() => {
        const filters = ['hue-rotate(90deg)', 'invert(1)', 'sepia(1)', 'contrast(2)', 'grayscale(1)', 'none'];
        setErrorRemixFilter(filters[Math.floor(Math.random() * filters.length)]);
      }, 1000);

      popupInterval = setInterval(() => {
        setErrorRemixPopups(prev => [...prev.slice(-20), {
          id: Date.now(),
          x: Math.random() * (window.innerWidth - 300),
          y: Math.random() * (window.innerHeight - 200),
          text: "ERROR ERROR ERROR"
        }]);
        playSound('error');
      }, 500);

      await new Promise(r => setTimeout(r, 33000));
      
      // Reset everything
      clearInterval(filterInterval);
      clearInterval(popupInterval);
      setErrorRemixActive(false);
      setErrorRemixPopups([]);
      setErrorRemixVideoVisible(false);
      setErrorRemixBSODVisible(false);
      setErrorRemixFlyingIcons(false);
      setErrorRemixColorful(false);
      setErrorRemixFilter('none');
      setIsRetroMode(false);
      setLoginScreenVisible(true);
    };

    sequence();
    return () => {
      clearInterval(filterInterval);
      clearInterval(popupInterval);
    };
  }, [errorRemixActive]);

  // APK Box Buddy Logic
  useEffect(() => {
    if (!boxBuddyActive) return;

    const moveInterval = setInterval(() => {
      setBuddyPos(prev => {
        const next = prev + 2;
        if (next > window.innerWidth) {
          setBuddyHasBox(true); // Refill box when offscreen
          return -100;
        }
        
        // Randomly drop box
        if (buddyHasBox && Math.random() < 0.01 && next > 100 && next < window.innerWidth - 100) {
          setBuddyHasBox(false);
          setFallingBoxes(prevBoxes => [...prevBoxes, { id: Date.now(), x: next + 20, y: window.innerHeight - 100, vy: -5 }]);
        }
        
        return next;
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, [boxBuddyActive, buddyHasBox]);

  useEffect(() => {
    if (fallingBoxes.length === 0 && explodedApks.length === 0) return;

    const physicsInterval = setInterval(() => {
      // Handle falling boxes
      setFallingBoxes(prev => {
        const next = prev.map(box => ({ ...box, y: box.y + box.vy, vy: box.vy + 0.5 }));
        const hittingBottom = next.filter(box => box.y >= window.innerHeight - 110);
        
        if (hittingBottom.length > 0) {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 300);
          playSound('error');
          
          // Explode!
          setExplodedApks(prevApks => [
            ...prevApks,
            ...hittingBottom.flatMap(box => 
              [...Array(10)].map((_, i) => ({
                id: Date.now() + i + Math.random(),
                x: box.x,
                y: box.y,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 1) * 15,
                rotation: Math.random() * 360
              }))
            )
          ]);
        }
        
        return next.filter(box => box.y < window.innerHeight - 110);
      });

      // Handle exploded APKs
      setExplodedApks(prev => {
        const next = prev.map(apk => ({
          ...apk,
          x: apk.x + apk.vx,
          y: apk.y + apk.vy,
          vy: apk.vy + 0.5,
          rotation: apk.rotation + apk.vx
        }));
        return next.filter(apk => apk.y < window.innerHeight + 100 && apk.x > -100 && apk.x < window.innerWidth + 100);
      });
    }, 30);

    return () => clearInterval(physicsInterval);
  }, [fallingBoxes, explodedApks]);

  const hackLogin = () => {
    const newClicks = loginClicks + 1;
    setLoginClicks(newClicks);
    if (newClicks === 3) {
      showNotification("Administrator Access Granted.", "https://files.softicons.com/download/application-icons/free-large-torrent-icons-by-aha-soft/png/128x128/Pirate%20bay.png");
    }
  };

  const clickClock = () => {
    let newClicks = clockClicks + 1;
    setClockClicks(newClicks);
    if (clockTimerRef.current) clearTimeout(clockTimerRef.current);
    clockTimerRef.current = setTimeout(() => setClockClicks(0), 1500);
    
    if (newClicks === 5) {
      setIsRetroMode(!isRetroMode);
      setClockClicks(0);
      showNotification(!isRetroMode ? "TIME TRAVEL INITIATED." : "Returned to present day.");
    }
  };

  const doLogin = () => {
    setLoginScreenVisible(false);
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        console.log("Fullscreen request needs direct user interaction or was blocked.");
      });
    }
  };

  const logOff = () => {
    setLaunchpadActive(false);
    setActiveWindows({});
    setLoginScreenVisible(true);
  };

  const openWindow = (appId: string) => {
    if (appId === 'dolphin') {
      setGravityEnabled(prev => !prev);
      return;
    }
    if (appId === 'error_remix') {
      startErrorRemix();
      return;
    }
    if (appId === 'boxbuddy') {
      setBoxBuddyActive(!boxBuddyActive);
      return;
    }
    if (['browser', 'youtube', 'chrome', 'stonemeni', 'claude', 'weather', 'roblox', 'cookiesoap', 'omg', 'chilled_windows'].includes(appId) && !wifiConnected) {
      showNotification("No Internet Connection", "https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/error.png");
      return;
    }
    const instanceId = `${appId}__${Date.now()}__${Math.random().toString(36).substr(2, 5)}`;
    setWindowInstances(prev => [...prev, { id: instanceId, appId }]);
    setActiveWindows(prev => ({ ...prev, [instanceId]: true }));
    bringToFront(instanceId);
  };

  const closeWindow = (id: string) => {
    setActiveWindows(prev => ({ ...prev, [id]: false }));
    setWindowInstances(prev => prev.filter(w => w.id !== id));
    
    if (id.startsWith('hydra')) {
      const newId1 = 'hydra_' + Math.random().toString(36).substring(2, 7);
      const newId2 = 'hydra_' + Math.random().toString(36).substring(2, 7);
      
      setApps(prev => ({
        ...prev,
        [newId1]: { name: 'hydra.exe', icon: prev['hydra'].icon, isDownloaded: true },
        [newId2]: { name: 'hydra.exe', icon: prev['hydra'].icon, isDownloaded: true }
      }));
      
      setTimeout(() => {
        setActiveWindows(prev => ({ ...prev, [newId1]: true, [newId2]: true }));
        setWindowPositions(prev => {
          const oldPos = prev[id] || { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 };
          return {
            ...prev,
            [newId1]: { x: oldPos.x - 50 + Math.random() * 100, y: oldPos.y - 50 + Math.random() * 100 },
            [newId2]: { x: oldPos.x - 50 + Math.random() * 100, y: oldPos.y - 50 + Math.random() * 100 }
          };
        });
      }, 100);
    }
  };

  const bringToFront = (id: string) => {
    setHighestZIndex(prev => {
      const nextZ = prev + 1;
      setWindowZIndices(zPrev => ({ ...zPrev, [id]: nextZ }));
      return nextZ;
    });
  };

  const toggleMaximize = (id: string) => {
    setMaximizedState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const downloadApp = (id: string) => {
    playSound('click');
    if (id === 'angrybirds' && !hasJohnnyQuarter) {
      playSound('error');
      showNotification("Payment failed: Insufficient funds! ($99.99 required)");
      return;
    }
    if (id === 'angrybirds' && hasJohnnyQuarter) {
      showNotification("Used Johnny's Quarter! Transaction successful.");
    }
    setPendingDownload(id);
  };

  const confirmDownloadApp = (id: string) => {
    setPendingDownload(null);
    setDownloadingApps(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      playSound('notification');
      setApps(prev => ({
        ...prev,
        [id]: { ...prev[id], isDownloaded: true }
      }));
      
      // Actually install to desktop
      setFileSystem(prevFs => {
        const newFs = JSON.parse(JSON.stringify(prevFs));
        const desktop = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'].contents;
        const appInfo = apps[id];
        if (appInfo) {
          desktop[`${appInfo.name}.exe`] = { type: 'file', icon: appInfo.icon, app: id };
        }
        return newFs;
      });

      setDownloadingApps(prev => ({ ...prev, [id]: false }));
    }, 1000);
  };

  const uninstallApp = (id: string) => {
    playSound('uninstall');
    setApps(prev => ({
      ...prev,
      [id]: { ...prev[id], isDownloaded: false }
    }));
    
    // Remove from desktop
    setFileSystem(prevFs => {
      const newFs = JSON.parse(JSON.stringify(prevFs));
      const desktop = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'].contents;
      const appInfo = apps[id];
      if (appInfo) {
        delete desktop[`${appInfo.name}.exe`];
      }
      return newFs;
    });

    closeWindow(id);
  };

  const publishApp = () => {
    const newCount = customAppCount + 1;
    setCustomAppCount(newCount);
    const id = 'published_app_' + newCount;
    
    setApps(prev => ({
      ...prev,
      [id]: { name: amName, icon: amIcon, isDownloaded: true, desc: 'User created app.', customHtml: amHtml, customBg: amBg, customColor: amColor, customFont: amFont }
    }));
    
    showNotification(`App '${amName}' published successfully!`, amIcon);
    closeWindow('appmaker');
  };

  const sendStoneMsg = () => {
    if (!stoneInput.trim()) return;
    const newMessages = [...stoneMessages, { sender: 'user', text: stoneInput }];
    setStoneMessages(newMessages);
    setStoneInput('');
    
    setTimeout(() => {
      setStoneMessages(prev => [...prev, { sender: 'bot', text: 'I am a rock. I do not know.' }]);
    }, 500);
  };

  // --- File Explorer Logic ---
  const getFolderFromPath = (pathArray: string[]) => {
    let current = fileSystem;
    for (let i = 0; i < pathArray.length; i++) {
        if(i === 0) current = current[pathArray[i]];
        else current = current.contents[pathArray[i]];
    }
    return current;
  };

  const loadDirectory = (rootDrive: string) => {
    setCurrentPath([rootDrive]);
  };

  const goUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(prev => prev.slice(0, -1));
    }
  };

  const openItem = (name: string, item: any) => {
    if (isKidsMode && item.app && !isKidFriendly(item.app)) {
      startBaldiChallenge();
      return;
    }
    if (item.type === 'folder') {
      setCurrentPath(prev => [...prev, name]);
    } else if (item.type === 'file') {
      if (item.app === 'imageviewer') {
        setSelectedImage(item.content);
      } else if (item.app === 'videoplayer') {
        setSelectedVideo(item.content);
      } else if (item.app === 'browser') {
        setSelectedUrl(item.content);
      } else if (item.app === 'flashplayer') {
        setSelectedFlashGame(item.content);
      } else if (item.app === 'nesplayer') {
        setSelectedNesGame(item.content);
      } else if (item.app === '000') {
        triggerRedMode();
        return;
      } else if (item.app === 'omg') {
        if (!wifiConnected) {
          showNotification("No Internet Connection", "https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/error.png");
          return;
        }
        setIsOmgActive(true);
        return;
      } else if (item.app === 'chilled_windows') {
        if (!wifiConnected) {
          showNotification("No Internet Connection", "https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/error.png");
          return;
        }
        triggerChilled();
        return;
      }
      openWindow(item.app);
    }
  };

  const triggerChilled = () => {
    setChilledState(1);
    setTimeout(() => {
      setChilledState(2);
    }, 2000);
    setTimeout(() => {
      setChilledState(3);
    }, 4000);
    setTimeout(() => {
      setChilledState(4);
    }, 9000);
    setTimeout(() => {
      setChilledState(5);
    }, 11000);
  };

  const triggerRedMode = () => {
    saveFsHistory();
    setIsBooting(true);
    setBootText("CRITICAL SYSTEM OVERRIDE...");
    setTimeout(() => {
      setIsRedMode(true);
      setUserName("ERROR_USER");
      setUserPfp("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLyCQ2rXuq-aGkIVq7GsKqQoPm15YhIVUmQQ&s");
      setApps(prev => {
        const newApps = { ...prev };
        Object.keys(newApps).forEach(id => {
          newApps[id] = { ...newApps[id], icon: textIcon };
        });
        return newApps;
      });
      setFileSystem(prev => {
        const newFs = JSON.parse(JSON.stringify(prev));
        const updateIcons = (node: any) => {
          if (!node || !node.contents) return;
          Object.values(node.contents).forEach((item: any) => {
            item.icon = textIcon;
            if (item.type === 'folder') updateIcons(item);
          });
        };
        Object.values(newFs).forEach(updateIcons);
        return newFs;
      });
      setIsBooting(false);
    }, 3000);
  };

  const undoFileOperation = () => {
    if (fsHistory.length === 0) return;
    const previousState = fsHistory[fsHistory.length - 1];
    setFsRedoStack(prev => [JSON.parse(JSON.stringify(fileSystem)), ...prev]);
    setFsHistory(prev => prev.slice(0, -1));
    setFileSystem(previousState);
    showNotification("Undo successful");
  };

  const redoFileOperation = () => {
    if (fsRedoStack.length === 0) return;
    const nextState = fsRedoStack[0];
    setFsHistory(prev => [...prev, JSON.parse(JSON.stringify(fileSystem))]);
    setFsRedoStack(prev => prev.slice(1));
    setFileSystem(nextState);
    showNotification("Redo successful");
  };

  const saveFsHistory = () => {
    setFsHistory(prev => [...prev, JSON.parse(JSON.stringify(fileSystem))]);
    setFsRedoStack([]);
  };

  const deleteItem = (path: string[]) => {
    if (path[0] === 'C:' && path[1] === 'Windows 11') {
      // Permanently delete if already in Recycle Bin
      saveFsHistory();
      setFileSystem(prev => {
        const newFs = JSON.parse(JSON.stringify(prev));
        let parent = newFs;
        for (let i = 0; i < path.length - 1; i++) {
          parent = i === 0 ? parent[path[i]] : parent.contents[path[i]];
        }
        const itemName = path[path.length - 1];
        const item = path.length === 1 ? parent[itemName] : parent.contents[itemName];

        if (item && item.app === 'pc') {
          setPcRemovalGifVisible(true);
          setTimeout(() => {
            setPcRemovalGifVisible(false);
            setErrorRemixBSODVisible(true);
          }, 6000);
        }

        if (path.length === 1) delete parent[itemName];
        else delete parent.contents[itemName];

        if (path.includes('Desktop')) {
          setDesktopIconPositions(prevPos => {
            const newPos = { ...prevPos };
            delete newPos[itemName];
            return newPos;
          });
        }

        return newFs;
      });
      showNotification(`Permanently deleted ${path[path.length - 1]}`);
      return;
    }

    saveFsHistory();
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      
      let sourceParent = newFs;
      for (let i = 0; i < path.length - 1; i++) {
        sourceParent = i === 0 ? sourceParent[path[i]] : sourceParent.contents[path[i]];
      }
      const itemName = path[path.length - 1];
      const item = path.length === 1 ? sourceParent[itemName] : sourceParent.contents[itemName];

      if (item && item.app === 'pc') {
        setPcRemovalGifVisible(true);
        setTimeout(() => {
          setPcRemovalGifVisible(false);
          setErrorRemixBSODVisible(true);
        }, 6000);
      }

      // Move to Windows 11 (Recycle Bin)
      const recycleBin = newFs['C:'].contents['Windows 11'].contents;
      let finalName = itemName;
      let counter = 1;
      while (recycleBin[finalName]) {
        finalName = `${itemName} (${counter})`;
        counter++;
      }
      recycleBin[finalName] = { ...item, originalPath: path };

      if (path.length === 1) delete sourceParent[itemName];
      else delete sourceParent.contents[itemName];
      
      if (path.includes('Desktop')) {
        setDesktopIconPositions(prevPos => {
          const newPos = { ...prevPos };
          delete newPos[itemName];
          return newPos;
        });
      }

      return newFs;
    });
    showNotification(`Moved ${path[path.length - 1]} to Windows 11 folder`);
  };

  const restoreItem = (path: string[]) => {
    saveFsHistory();
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const recycleBin = newFs['C:'].contents['Windows 11'].contents;
      const itemName = path[path.length - 1];
      const item = recycleBin[itemName];

      if (!item) return prev;

      const originalPath = item.originalPath || ['C:', 'Users', 'Gomer', 'Desktop', itemName];
      const targetParentPath = originalPath.slice(0, -1);
      const targetName = originalPath[originalPath.length - 1];

      let parent = newFs;
      try {
        for (let i = 0; i < targetParentPath.length; i++) {
          parent = i === 0 ? parent[targetParentPath[i]] : parent.contents[targetParentPath[i]];
        }
      } catch (e) {
        parent = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'];
      }

      if (!parent.contents) parent.contents = {};

      let finalName = targetName;
      let counter = 1;
      while (parent.contents[finalName]) {
        finalName = `${targetName} (${counter})`;
        counter++;
      }

      const restoredItem = { ...item };
      delete restoredItem.originalPath;
      parent.contents[finalName] = restoredItem;

      delete recycleBin[itemName];
      return newFs;
    });
    showNotification(`Restored ${path[path.length - 1]}`);
  };

  const emptyRecycleBin = () => {
    saveFsHistory();
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      newFs['C:'].contents['Windows 11'].contents = {};
      return newFs;
    });
    showNotification("Windows 11 folder cleared");
    playSound('error');
  };

  const moveItem = (sourcePath: string[], destPath: string[]) => {
    saveFsHistory();
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      
      // Get source parent
      let sourceParent = newFs;
      for (let i = 0; i < sourcePath.length - 1; i++) {
        sourceParent = i === 0 ? sourceParent[sourcePath[i]] : sourceParent.contents[sourcePath[i]];
      }
      const itemName = sourcePath[sourcePath.length - 1];
      const item = sourcePath.length === 1 ? sourceParent[itemName] : sourceParent.contents[itemName];

      // Get dest folder
      let destFolder = newFs;
      for (let i = 0; i < destPath.length; i++) {
        destFolder = i === 0 ? destFolder[destPath[i]] : destFolder.contents[destPath[i]];
      }

      if (!destFolder || destFolder.type !== 'folder') return prev;

      // Move
      if (sourcePath.length === 1) delete sourceParent[itemName];
      else delete sourceParent.contents[itemName];
      
      destFolder.contents[itemName] = item;

      return newFs;
    });
  };

  const renameItem = (path: string[], newName: string) => {
    if (!newName || newName.trim() === '') {
      setRenamingPath(null);
      return;
    }
    saveFsHistory();
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      let parent = newFs;
      for (let i = 0; i < path.length - 1; i++) {
        parent = i === 0 ? parent[path[i]] : parent.contents[path[i]];
      }
      const oldName = path[path.length - 1];
      const items = path.length === 1 ? parent : parent.contents;
      const item = items[oldName];
      
      if (oldName === newName) return prev;
      if (items[newName]) {
        showNotification("A file with that name already exists");
        return prev;
      }

      delete items[oldName];
      items[newName] = item;
      return newFs;
    });
    setRenamingPath(null);
  };

  const syncDesktopToExplorer = () => {
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev)); // Deep copy for simplicity
      const desktopFolder = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'].contents;
      
      // Remove apps that are no longer downloaded
      for (let key in desktopFolder) {
        if (desktopFolder[key].type === 'file' && desktopFolder[key].app && apps[desktopFolder[key].app]) {
          if (!apps[desktopFolder[key].app].isDownloaded) {
            delete desktopFolder[key];
          }
        }
      }
      
      // Add downloaded apps if not present
      for (let id in apps) {
        if (apps[id].isDownloaded) {
          const fileName = apps[id].name + '.exe';
          // Only add if not already there (avoid duplicates)
          const alreadyExists = Object.values(desktopFolder).some((item: any) => item.app === id);
          if (!alreadyExists) {
            desktopFolder[fileName] = { type: 'file', icon: apps[id].icon, app: id };
          }
        }
      }
      return newFs;
    });
  };

  const moveItemToFolder = (itemName: string, targetFolderName: string) => {
    saveFsHistory();
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const desktop = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'];
      const item = desktop.contents[itemName];
      const targetFolder = desktop.contents[targetFolderName];
      
      if (item && targetFolder && targetFolder.type === 'folder') {
        if (!targetFolder.contents) targetFolder.contents = {};
        targetFolder.contents[itemName] = item;
        delete desktop.contents[itemName];
        
        // Remove from desktop positions
        setDesktopIconPositions(prevPos => {
          const newPos = { ...prevPos };
          delete newPos[itemName];
          return newPos;
        });
      }
      return newFs;
    });
    showNotification(`Moved ${itemName} to ${targetFolderName}`);
  };

  const createNewFile = (name: string, type: 'file' | 'folder', ext: string = '', content: string = '') => {
    saveFsHistory();
    setFileSystem(prev => {
      const newFs = JSON.parse(JSON.stringify(prev));
      const desktopFolder = newFs['C:'].contents['Users'].contents['Gomer'].contents['Desktop'].contents;
      
      let fileName = name + (ext ? '.' + ext : '');
      let counter = 1;
      while (desktopFolder[fileName]) {
        fileName = `${name} (${counter})${ext ? '.' + ext : ''}`;
        counter++;
      }

      let icon = folderIcon;
      let app = '';
      if (type === 'file') {
        if (ext === 'txt') { icon = textIcon; app = 'textdocs'; }
        else if (ext === 'png') { icon = pngIcon; app = 'imageviewer'; }
        else if (ext === 'html') { icon = htmlIcon; app = 'browser'; }
        else if (ext === 'gif') { icon = gifIcon; app = 'imageviewer'; }
        else if (ext === 'mp4') { icon = mp4Icon; app = 'flashplayer'; }
        else if (ext === 'mp3') { icon = mp3Icon; app = 'flashplayer'; }
      }

      desktopFolder[fileName] = { type, icon, app, content: content || (type === 'file' ? '' : {}) };
      return newFs;
    });
  };

  const handleExternalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const url = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
    if (url) {
      const fileName = url.split('/').pop()?.split('?')[0] || 'dropped_file';
      const ext = fileName.split('.').pop()?.toLowerCase() || 'png';
      const nameOnly = fileName.replace('.' + ext, '');
      
      let finalExt = ext;
      if (!['png', 'html', 'gif', 'mp4', 'mp3'].includes(ext)) {
        finalExt = 'png'; // Fallback to png as requested
      }
      
      createNewFile(nameOnly, 'file', finalExt, url);
      showNotification(`Created ${nameOnly}.${finalExt} from web`);
    }
  };

  // --- Render Helpers ---

  const isKidFriendly = (appId: string) => {
    const forbidden = [
      'settings', 'terminal', 'sysmon', 'taskmanager', 'outlook', 'metatrader', 
      'matlab', 'eve', 'fallout', 'wine', 'utorrent', '000', 'omg', 
      'chilled_windows', 'claude', 'hydra', 'winxphorror', 'appmaker', 'w3shit'
    ];
    return !forbidden.includes(appId);
  };

  const startBaldiChallenge = () => {
    setIsBaldiChallenge(true);
    setBaldiQuestionCount(1);
    setBaldiPhase('math');
    generateBaldiQuestion();
  };

  const generateBaldiQuestion = () => {
    const num1 = Math.floor(Math.random() * (baldiQuestionCount > 10 ? 100 : 50)) + 1;
    const num2 = Math.floor(Math.random() * (baldiQuestionCount > 10 ? 100 : 50)) + 1;
    const ops = baldiQuestionCount > 15 ? ['+', '-', '*', '/'] : ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let ans = 0;
    let question = "";

    if (op === '+') {
      ans = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else if (op === '-') {
      ans = num1 - num2;
      question = `${num1} - ${num2} = ?`;
    } else if (op === '*') {
      const mult = Math.floor(Math.random() * (baldiQuestionCount > 10 ? 12 : 9)) + 2;
      ans = num1 * mult;
      question = `${num1} * ${mult} = ?`;
    } else {
      // Division
      const mult = Math.floor(Math.random() * 10) + 1;
      ans = num1;
      question = `${num1 * mult} / ${mult} = ?`;
    }
    
    setBaldiQuestion({ q: question, a: ans });
    setBaldiInput('');
  };

  const startBiosPhase = () => {
    setBaldiPhase('bios');
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    setBaldiBiosKey(key);
    setBaldiBiosInput('');
  };

  const startPuzzlePhase = () => {
    setBaldiPhase('puzzle');
    const pattern = Array.from({length: 5}, () => Math.floor(Math.random() * 9));
    setBaldiPuzzlePattern(pattern);
    setBaldiPuzzleInput([]);
    
    // Flash pattern
    let i = 0;
    const interval = setInterval(() => {
      setBaldiPuzzleInput([pattern[i]]);
      i++;
      if (i >= pattern.length) {
        clearInterval(interval);
        setTimeout(() => setBaldiPuzzleInput([]), 500);
      }
    }, 800);
  };

  const checkBaldiAnswer = () => {
    const isCorrect = parseInt(baldiInput) === baldiQuestion.a;
    if (isCorrect) {
      if (baldiQuestionCount === 5) {
        startBiosPhase();
      } else if (baldiQuestionCount === 10) {
        startPuzzlePhase();
      } else if (baldiQuestionCount >= 20) {
        setIsKidsMode(false);
        setIsBaldiChallenge(false);
        showNotification("SECURITY BYPASS SUCCESSFUL");
      } else {
        setBaldiQuestionCount(prev => prev + 1);
        generateBaldiQuestion();
        playSound('notification');
      }
    } else {
      triggerBricked();
    }
  };

  const triggerBricked = () => {
    localStorage.setItem('OS_BRICKED', 'true');
    setBsodForever(true);
    playSound('error');
  };

  const handleBiosKeyInput = () => {
    if (baldiBiosInput.toUpperCase() === baldiBiosKey) {
      setBaldiQuestionCount(6);
      setBaldiPhase('math');
      generateBaldiQuestion();
      playSound('notification');
    } else {
      triggerBricked();
    }
  };

  const handlePuzzleClick = (idx: number) => {
    const nextInput = [...baldiPuzzleInput, idx];
    setBaldiPuzzleInput(nextInput);
    
    if (nextInput[nextInput.length - 1] !== baldiPuzzlePattern[nextInput.length - 1]) {
      triggerBricked();
      return;
    }

    if (nextInput.length === baldiPuzzlePattern.length) {
      setBaldiQuestionCount(11);
      setBaldiPhase('math');
      generateBaldiQuestion();
      playSound('notification');
    }
  };

  const isCoreApp = (id: string) => ['aboutme', 'pc', 'chrome', 'textdocs'].includes(id);

  const renderDesktopIcons = () => {
    const desktopPath = ['C:', 'Users', 'Gomer', 'Desktop'];
    const desktopFolder = getFolderFromPath(desktopPath);
    const items = desktopFolder?.contents ? Object.entries(desktopFolder.contents) : [];

    // Sort
    items.sort((a, b) => {
      const nameA = a[0];
      const nameB = b[0];
      const itemA = a[1] as any;
      const itemB = b[1] as any;
      
      if (desktopSortBy === 'name') return nameA.localeCompare(nameB);
      if (desktopSortBy === 'type') return itemA.type.localeCompare(itemB.type);
      return Math.random() - 0.5; // Chaotic random sort for the time options
    });

    const sizeClassMap: Record<string, string> = {
      'Invisible': 'opacity-0 scale-0 pointer-events-none',
      'MicroScopic': 'scale-[0.25]',
      'A little Small': 'scale-50',
      'Small': 'scale-75',
      'A little Medium': 'scale-90',
      'Medium': 'scale-100',
      'A bit large': 'scale-110',
      'Large': 'scale-125',
      'Big': 'scale-150',
      'SO BIG': 'scale-[2.5] z-[100] origin-top-left',
      'For Grandmas': 'scale-[4] z-[200] origin-top-left',
      'Gigantic': 'scale-[8] z-[300] origin-top-left',
      'HOLY SHIT!': 'scale-[15] z-[400] origin-top-left',
      'MY GOODNESS WITCH ONE IS WITCH?': 'scale-[30] z-[500] origin-top-left'
    };
    
    // Fallback if none matched
    const sizeClass = sizeClassMap[desktopViewSize] || (
      desktopViewSize === 'small' ? 'scale-75' : 
      desktopViewSize === 'large' ? 'scale-125' : 
      'scale-100'
    );

    const sortAnimClass = desktopSortBy === 'By Second' ? 'animate-[bounce_0.5s_infinite]' :
                          desktopSortBy === 'By millisecond' ? 'animate-[ping_0.2s_infinite]' :
                          desktopSortBy === 'By.... HypoDynamicSecond' ? 'animate-[spin_0.05s_linear_infinite]' : '';

    return items
      .filter(([name, item]: [string, any]) => {
        if (!isKidsMode) return true;
        if (item.type === 'folder') return true;
        if (!item.app) return true;
        return isKidFriendly(item.app);
      })
      .map(([name, item]: [string, any], index) => {
      const pos = desktopIconPositions[name] || { x: 20 + Math.floor(index / 8) * 100, y: 20 + (index % 8) * 100 };
      const isDragging = draggingIcon?.name === name;
      const fullPath = [...desktopPath, name];
      const isBlanked = blankedIcons.has(fullPath.join('\\'));
      const isRenaming = renamingPath?.join('\\') === fullPath.join('\\');

      return (
        <div 
          key={name} 
          className={`icon ${sizeClass} ${sortAnimClass} absolute ${isDragging ? 'dragging' : ''} ${selectedDesktopIcons.includes(name) ? 'bg-white/30 rounded ring-2 ring-white/50' : ''} ${isScissorsActive && !isBlanked ? 'hover:scale-95 hover:rotate-6 cursor-crosshair' : ''}`} 
          style={{ left: pos.x, top: pos.y, transition: isDragging ? 'none' : 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
          onClick={() => {
            if (isScissorsActive && !isBlanked) {
              setBlankedIcons(prev => {
                const next = new Set(prev);
                next.add(fullPath.join('\\'));
                return next;
              });
              playSound('uninstall');
            }
          }}
          onDoubleClick={() => {
            if (!isRenaming && !isScissorsActive) {
              if (selectedDesktopIcons.includes(name)) {
                selectedDesktopIcons.forEach(selectedName => {
                  const desktopPath = ['C:', 'Users', 'Gomer', 'Desktop'];
                  const desktopFolder = getFolderFromPath(desktopPath);
                  const selectedItem = desktopFolder?.contents[selectedName];
                  if (selectedItem) openItem(selectedName, selectedItem);
                });
              } else {
                openItem(name, item);
              }
            }
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetName: name });
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            
            const groupOffsets: Record<string, {offsetX: number, offsetY: number}> = {};
            if (selectedDesktopIcons.includes(name)) {
              selectedDesktopIcons.forEach(selectedName => {
                const itemPos = desktopIconPositions[selectedName];
                if (itemPos) {
                  groupOffsets[selectedName] = { 
                    offsetX: e.clientX - itemPos.x, 
                    offsetY: e.clientY - itemPos.y 
                  };
                } else {
                  // Fallback if position somehow wasn't cached, although rare
                  const desktopPath = ['C:', 'Users', 'Gomer', 'Desktop'];
                  const desktopFolder = getFolderFromPath(desktopPath);
                  const items = desktopFolder?.contents ? Object.entries(desktopFolder.contents) : [];
                  const index = items.findIndex(([itemIdxName]) => itemIdxName === selectedName);
                  if (index !== -1) {
                    const defaultPos = { x: 20 + Math.floor(index / 8) * 100, y: 20 + (index % 8) * 100 };
                    groupOffsets[selectedName] = { 
                      offsetX: e.clientX - defaultPos.x, 
                      offsetY: e.clientY - defaultPos.y 
                    };
                  }
                }
              });
            }

            setDraggingIcon({ 
              name, 
              offsetX: e.clientX - rect.left, 
              offsetY: e.clientY - rect.top,
              groupOffsets: Object.keys(groupOffsets).length > 0 ? groupOffsets : undefined
            });
          }}
        >
          {isBlanked ? (
             <div className="w-12 h-12" />
          ) : (
             <img src={isRedMode ? textIcon : item.icon} alt={name} />
          )}
          {isRenaming ? (
            <input
              autoFocus
              className="text-black text-xs w-full px-1 text-center outline-none rounded"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => renameItem(fullPath, renameValue)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') renameItem(fullPath, renameValue);
                if (e.key === 'Escape') setRenamingPath(null);
                e.stopPropagation();
              }}
              onDoubleClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div 
              className="truncate w-full px-1"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setRenamingPath(fullPath);
                setRenameValue(name);
              }}
            >
              {!isBlanked && t(name)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderLaunchpadIcons = () => {
    return Object.entries(apps as Record<string, any>)
      .filter(([id, app]) => {
        const isDown = app.isDownloaded && (!debugSettings.safeMode || isCoreApp(id));
        if (!isKidsMode) return isDown;
        return isDown && isKidFriendly(id);
      })
      .map(([id, app]) => (
        <div key={id} className="lp-icon" onClick={() => { openWindow(id); setLaunchpadActive(false); }}>
          <img src={app.icon} alt={app.name} />
          <span>{t(id)}</span>
        </div>
      ));
  };

  const renderStoreItems = () => {
    return Object.entries(apps as Record<string, any>)
      .filter(([id]) => {
        const standardFilter = !['chrome', 'stonemeni', 'doge', 'appmaker', 'youtube', 'aboutme'].includes(id) && !id.startsWith('published_app_') && !debugSettings.safeMode;
        if (!isKidsMode) return standardFilter;
        return standardFilter && isKidFriendly(id);
      })
      .map(([id, app]) => (
        <div key={id} className="store-item">
          <img src={app.icon} alt={app.name} />
          <div className="store-item-info">
            <h4>{t(id)}</h4>
            <p>{app.desc}</p>
          </div>
          {app.isDownloaded ? (
            <div className="flex gap-2">
              <button className="dl-btn" disabled style={{ background: '#34A853' }}>Installed</button>
              {!['chrome', 'stonemeni', 'appmaker', 'youtube', 'aboutme', 'pc', 'settings', 'cydia'].includes(id) && (
                <button className="dl-btn" style={{ background: '#EA4335' }} onClick={() => uninstallApp(id)}>Delete</button>
              )}
            </div>
          ) : downloadingApps[id] ? (
            <button className="dl-btn" disabled style={{ background: '#FBBC05' }}>Downloading...</button>
          ) : (
            <button className="dl-btn" onClick={() => downloadApp(id)}>Download</button>
          )}
        </div>
      ));
  };

  const renderExplorerContent = () => {
    if (explorerSearchQuery.trim()) {
      const results: {name: string, item: any, path: string[]}[] = [];
      const query = explorerSearchQuery.toLowerCase();
      
      const searchNode = (node: any, path: string[]) => {
        if (!node || !node.contents) return;
        Object.entries(node.contents).forEach(([name, item]: [string, any]) => {
          const matchesName = name.toLowerCase().includes(query);
          const matchesContent = item.type === 'file' && typeof item.content === 'string' && item.content.toLowerCase().includes(query);
          
          if (matchesName || matchesContent) {
            results.push({ name, item, path: [...path, name] });
          }
          
          if (item.type === 'folder') {
            searchNode(item, [...path, name]);
          }
        });
      };
      
      const currentFolder = getFolderFromPath(currentPath);
      searchNode(currentFolder, currentPath);
      
      const filteredResults = results.filter(r => {
        if (!isKidsMode) return true;
        if (r.item.type === 'folder') return true;
        if (!r.item.app) return true;
        return isKidFriendly(r.item.app);
      });

      if (filteredResults.length === 0) {
        return <div className="text-gray-500 w-full text-center mt-10">No items match your search.</div>;
      }
      
      return filteredResults.map((result, idx) => {
        const isBlanked = blankedIcons.has(result.path.join('\\'));
        const iconUrl = isBlanked ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' : (isRedMode ? textIcon : (result.item.type === 'folder' ? folderIcon : result.item.icon));
        const isRenaming = renamingPath?.join('\\') === result.path.join('\\');
        return (
          <div 
            key={idx} 
            className="file-item" 
            onClick={() => {
              if (isScissorsActive) {
                setBlankedIcons(prev => {
                  const next = new Set(prev);
                  next.add(result.path.join('\\'));
                  return next;
                });
                playSound('uninstall');
              }
            }}
            onDoubleClick={() => !isRenaming && !isScissorsActive && openItem(result.name, result.item)}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExplorerContextMenu({ x: e.clientX, y: e.clientY, path: result.path });
            }}
            draggable={!isRenaming}
            onDragStart={(e) => {
              e.dataTransfer.setData('sourcePath', JSON.stringify(result.path));
            }}
            onDragOver={(e) => {
              if (result.item.type === 'folder') e.preventDefault();
            }}
            onDrop={(e) => {
              if (result.item.type === 'folder') {
                e.preventDefault();
                const sourcePath = JSON.parse(e.dataTransfer.getData('sourcePath'));
                moveItem(sourcePath, result.path);
              }
            }}
          >
            <img src={iconUrl} alt={result.name} />
            {isRenaming ? (
              <input
                autoFocus
                className="text-black text-xs w-full px-1 text-center outline-none border border-blue-500 rounded"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={() => renameItem(result.path, renameValue)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') renameItem(result.path, renameValue);
                  if (e.key === 'Escape') setRenamingPath(null);
                  e.stopPropagation();
                }}
                onDoubleClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setRenamingPath(result.path);
                  setRenameValue(result.name);
                }}
              >
                {!blankedIcons.has(result.path.join('\\')) && result.name}
              </span>
            )}
            {!blankedIcons.has(result.path.join('\\')) && <span className="text-[9px] opacity-50 block w-full truncate mt-1">{result.path.slice(0, -1).join('\\')}</span>}
          </div>
        );
      });
    }

    const currentFolder = getFolderFromPath(currentPath);
    if (!currentFolder || !currentFolder.contents) return null;

    return Object.entries(currentFolder.contents)
      .filter(([name, item]: [string, any]) => {
        if (!isKidsMode) return true;
        if (item.type === 'folder') return true;
        if (!item.app) return true;
        return isKidFriendly(item.app);
      })
      .map(([itemName, item]: [string, any]) => {
      const fullPath = [...currentPath, itemName];
      const isBlanked = blankedIcons.has(fullPath.join('\\'));
      const iconUrl = isBlanked ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' : (isRedMode ? textIcon : (item.type === 'folder' ? folderIcon : item.icon));
      const isRenaming = renamingPath?.join('\\') === fullPath.join('\\');

      return (
        <div 
          key={itemName} 
          className="file-item" 
          onClick={() => {
            if (isScissorsActive) {
              setBlankedIcons(prev => {
                const next = new Set(prev);
                next.add(fullPath.join('\\'));
                return next;
              });
              playSound('uninstall');
            }
          }}
          onDoubleClick={() => !isRenaming && !isScissorsActive && openItem(itemName, item)}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setExplorerContextMenu({ x: e.clientX, y: e.clientY, path: fullPath });
          }}
          draggable={!isRenaming}
          onDragStart={(e) => {
            e.dataTransfer.setData('sourcePath', JSON.stringify(fullPath));
          }}
          onDragOver={(e) => {
            if (item.type === 'folder') e.preventDefault();
          }}
          onDrop={(e) => {
            if (item.type === 'folder') {
              e.preventDefault();
              const sourcePath = JSON.parse(e.dataTransfer.getData('sourcePath'));
              moveItem(sourcePath, fullPath);
            }
          }}
        >
          <img src={iconUrl} alt={itemName} />
          {isRenaming ? (
            <input
              autoFocus
              className="text-black text-xs w-full px-1 text-center outline-none border border-blue-500 rounded"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => renameItem(fullPath, renameValue)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') renameItem(fullPath, renameValue);
                if (e.key === 'Escape') setRenamingPath(null);
                e.stopPropagation();
              }}
              onDoubleClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <span 
              onDoubleClick={(e) => {
                e.stopPropagation();
                setRenamingPath(fullPath);
                setRenameValue(itemName);
              }}
            >
              {!blankedIcons.has(fullPath.join('\\')) && itemName}
            </span>
          )}
        </div>
      );
    });
  };

  const renderJohnnysStore = () => {
    if (!isJohnnysStoreVisible) return null;
    return (
      <div className="absolute bottom-12 left-0 right-0 h-48 bg-black/90 backdrop-blur-xl border-t-4 border-yellow-500 z-[10000] flex animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
         <div className="w-48 h-full relative overflow-hidden group border-r border-yellow-500/20">
            <img 
              src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/d/da/Johnny.png/revision/latest/thumbnail/width/360/height/360?cb=20200913100623&path-prefix=ru" 
              className="absolute bottom-0 left-0 h-[130%] object-contain grayscale group-hover:grayscale-0 transition-all duration-1000"
              alt="Johnny" 
            />
         </div>
         <div className="flex-1 flex items-center gap-6 overflow-x-auto px-10 custom-scrollbar">
            {!hasJohnnyQuarter && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyQuarter(true);
                showNotification("Obtained Johnny's Quarter!", "https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/a/a4/QuarterIcon_Large.png/revision/latest/scale-to-width/360?cb=20260414091602");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/a/a4/QuarterIcon_Large.png/revision/latest/scale-to-width/360?cb=20260414091602" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,255,0,0.3)] group-hover:scale-110 transition-transform" />
              <span className="text-yellow-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-yellow-400/10 px-2 py-0.5 rounded">Quarter</span>
            </div>
            )}
            
            {!hasIkeaQuarter && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasIkeaQuarter(true);
                showNotification("Obtained IKEA Quarter! LaunchPad unlocked.");
                playSound('notification');
              }}
            >
              <img src="https://en.numista.com/catalogue/photos/etats-unis/606372bd460041.80261589-original.jpg" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,255,0,0.3)] group-hover:scale-110 transition-transform" />
              <span className="text-yellow-600 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-yellow-600/10 px-2 py-0.5 rounded">IKEA Qtr</span>
            </div>
            )}
            
            {!hasJohnnyScissors && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyScissors(true);
                showNotification("Obtained Safety Scissors!", "https://static.wikia.nocookie.net/bbccs/images/6/64/SafetyScissors.png/revision/latest/thumbnail/width/360/height/450?cb=20220902152822");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/bbccs/images/6/64/SafetyScissors.png/revision/latest/thumbnail/width/360/height/450?cb=20220902152822" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,100,200,0.3)] group-hover:scale-110 transition-transform" />
              <span className="text-pink-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-pink-400/10 px-2 py-0.5 rounded">Scissors</span>
            </div>
            )}

            {!hasJohnnyGrapplingHook && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyGrapplingHook(true);
                showNotification("Obtained Grappling Hook (Useless)!");
                playSound('notification');
              }}
            >
              <img src="https://static.wikitide.net/baldisbasicswiki/2/25/GrapplingHookIcon.png" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform brightness-50" />
              <span className="text-gray-500 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-gray-500/10 px-2 py-0.5 rounded">Hook</span>
            </div>
            )}

            {!hasJohnnyPhone && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyPhone(true);
                showNotification("Obtained Noisy Phone!");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/7/7f/Phoneog.png/revision/latest/thumbnail/width/360/height/450?cb=20180517015737" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <span className="text-blue-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-blue-400/10 px-2 py-0.5 rounded">Phone</span>
            </div>
            )}

            {!hasJohnnyStudent && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyStudent(true);
                showNotification("Obtained... a Student?");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/bbccs/images/0/0b/Student.png/revision/latest?cb=20231229152928" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <span className="text-green-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-green-400/10 px-2 py-0.5 rounded">Student</span>
            </div>
            )}

            {!hasJohnnyBsoda && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyBsoda(true);
                showNotification("Obtained BSODA!");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/3/3a/BsodaIcon_Large.png/revision/latest/scale-to-width/360?cb=20250627002908" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <span className="text-blue-500 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-blue-500/10 px-2 py-0.5 rounded">BSODA</span>
            </div>
            )}

            {!hasJohnnyDietBsoda && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyDietBsoda(true);
                showNotification("Obtained Diet BSODA!");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/8/82/DietBsodaIcon_Large.png/revision/latest/scale-to-width/360?cb=20240709201127" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <span className="text-blue-300 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-blue-300/10 px-2 py-0.5 rounded">Diet BSODA</span>
            </div>
            )}

            {!hasJohnnyGum && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyGum(true);
                showNotification("Obtained Sticky Gum!");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/baldi-fanon/images/f/f0/Gum.png/revision/latest/thumbnail/width/360/height/360?cb=20200531105628" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <span className="text-pink-300 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-pink-300/10 px-2 py-0.5 rounded">Gum</span>
            </div>
            )}

            {!hasJohnnyHandgun && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyHandgun(true);
                showNotification("Obtained... wait, a Handgun?!");
                playSound('notification');
              }}
            >
              <img src="https://static.vecteezy.com/system/resources/thumbnails/025/213/598/small/police-handgun-3d-illustration-png.png" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <span className="text-red-500 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-red-500/10 px-2 py-0.5 rounded">Handgun</span>
            </div>
            )}

            {!hasJohnnyRuler && (
            <div 
              className="flex flex-col items-center gap-2 cursor-pointer group shrink-0"
              onClick={() => {
                setHasJohnnyRuler(true);
                showNotification("Obtained Spare Ruler!");
                playSound('notification');
              }}
            >
              <img src="https://static.wikia.nocookie.net/baldi-fanon/images/0/09/Spare_Ruler.png/revision/latest?cb=20180627072722" className="w-16 h-16 drop-shadow-lg group-hover:scale-110 transition-transform" />
              <span className="text-yellow-600 font-mono text-[10px] font-bold uppercase tracking-[0.2em] bg-yellow-600/10 px-2 py-0.5 rounded">Ruler</span>
            </div>
            )}
            
            {(hasJohnnyQuarter && hasJohnnyScissors && hasJohnnyGrapplingHook && hasJohnnyPhone && hasJohnnyStudent && hasJohnnyBsoda && hasJohnnyDietBsoda && hasJohnnyGum && hasJohnnyHandgun && hasJohnnyRuler) && (
              <div className="text-yellow-500 font-black italic text-xl uppercase tracking-widest opacity-30 animate-pulse shrink-0">Sold Out</div>
            )}
         </div>
         <div className="w-48 pr-6 flex flex-col justify-center gap-2 items-end shrink-0 border-l border-yellow-500/20">
            <button className="text-white bg-blue-600 px-6 py-2 font-black uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg border-b-4 border-blue-900 text-xs" onClick={() => setIsJohnnysStoreVisible(false)}>Close Shop</button>
            <div className="text-[9px] text-gray-400 font-mono italic text-right mt-1 leading-tight">"Stocking up for the big test, eh?"</div>
         </div>
      </div>
    );
  };

  const renderInventory = () => {
    return (
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 flex items-center justify-center z-[9999] pointer-events-none p-2 bg-transparent">
        <div className="flex bg-[url('https://media.forgecdn.net/avatars/thumbnails/1031/807/256/256/638554680736765570.png')] bg-contain bg-center bg-repeat-x w-fit h-14 p-1 shadow-2xl relative" style={{ imageRendering: 'pixelated' }}>
          
          {hasJohnnyQuarter && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="Johnnys Quarter - Use in Store">
                <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/a/a4/QuarterIcon_Large.png/revision/latest/scale-to-width/360?cb=20260414091602" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyScissors && (
             <div 
               className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" 
               title="Safety Scissors - Toggle to blank icons"
               onClick={() => { setIsScissorsActive(!isScissorsActive); setIsHandgunActive(false); }}
              >
                {isScissorsActive && <img src="https://static.planetminecraft.com/files/image/minecraft/data-pack/2021/538/14034202-pack_xl.webp" className="absolute inset-0 w-14 h-14 -left-1 -top-1 pointer-events-none max-w-none opacity-80" style={{ imageRendering: 'pixelated' }} />}
                <img src="https://static.wikia.nocookie.net/bbccs/images/6/64/SafetyScissors.png/revision/latest/thumbnail/width/360/height/450?cb=20220902152822" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyHandgun && (
             <div 
               className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" 
               title="Handgun - Click to use"
               onClick={() => { setIsHandgunActive(!isHandgunActive); setIsScissorsActive(false); }}
              >
                {isHandgunActive && <img src="https://static.planetminecraft.com/files/image/minecraft/data-pack/2021/538/14034202-pack_xl.webp" className="absolute inset-0 w-14 h-14 -left-1 -top-1 pointer-events-none max-w-none opacity-80" style={{ imageRendering: 'pixelated' }} />}
                <img src="https://static.vecteezy.com/system/resources/thumbnails/025/213/598/small/police-handgun-3d-illustration-png.png" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyGrapplingHook && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="Grappling Hook - Useless.">
                <img src="https://static.wikitide.net/baldisbasicswiki/2/25/GrapplingHookIcon.png" className="w-8 h-8 brightness-50 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyPhone && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="Noisy Phone - Ring ring!" onClick={() => playSound('notification')}>
                <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/7/7f/Phoneog.png/revision/latest/thumbnail/width/360/height/450?cb=20180517015737" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyStudent && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="Student - Just staring at you.">
                <img src="https://static.wikia.nocookie.net/bbccs/images/0/0b/Student.png/revision/latest?cb=20231229152928" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyBsoda && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="BSODA - Push away icons!" onClick={() => {
                playSound('notification');
                showNotification("BSODA SPRAYED!");
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);
             }}>
                <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/3/3a/BsodaIcon_Large.png/revision/latest/scale-to-width/360?cb=20250627002908" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyDietBsoda && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="Diet BSODA - Half the calories, same spray!" onClick={() => showNotification("DIET BSODA SPRAYED!")}>
                <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/8/82/DietBsodaIcon_Large.png/revision/latest/scale-to-width/360?cb=20240709201127" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyGum && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="Gum - Sticky!" onClick={() => showNotification("GUM STUCK!")}>
                <img src="https://static.wikia.nocookie.net/baldi-fanon/images/f/f0/Gum.png/revision/latest/thumbnail/width/360/height/360?cb=20200531105628" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
          {hasJohnnyRuler && (
             <div className="w-12 h-12 flex items-center justify-center relative group pointer-events-auto cursor-pointer" title="Ruler - Slapping noises" onClick={() => playSound('error')}>
                <img src="https://static.wikia.nocookie.net/baldi-fanon/images/0/09/Spare_Ruler.png/revision/latest?cb=20180627072722" className="w-8 h-8 hover:scale-110 drop-shadow-[5px_5px_0_rgba(0,0,0,0.5)]" />
             </div>
          )}
        </div>
      </div>
    );
  };

  const renderSearchResults = () => {
    const query = searchQuery.toLowerCase();
    
    // Search Apps
    const appResults = Object.entries(apps as Record<string, any>)
      .filter(([id, app]) => app.isDownloaded && (app.name.toLowerCase().includes(query) || t(id).toLowerCase().includes(query)))
      .map(([id, app]) => (
        <div 
          key={`app-${id}`} 
          className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors"
          onClick={() => { openWindow(id); setIsSearchActive(false); setSearchQuery(''); }}
        >
          <img src={app.icon} alt={app.name} className="w-5 h-5" />
          <div className="flex flex-col">
            <span>{t(id)}</span>
            <span className="text-[10px] opacity-70">App</span>
          </div>
        </div>
      ));

    // Search Files (recursive)
    const fileResults: React.ReactNode[] = [];
    const searchFolder = (folder: any, path: string[]) => {
      if (!folder || !folder.contents) return;
      for (const [name, item] of Object.entries(folder.contents)) {
        if (name.toLowerCase().includes(query)) {
          const isFolder = (item as any).type === 'folder';
          const iconUrl = isFolder ? folderIcon : (item as any).icon || textIcon;
          fileResults.push(
            <div 
              key={`file-${path.join('-')}-${name}`} 
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors"
              onClick={() => {
                if (isFolder) {
                  setCurrentPath([...path, name]);
                  openWindow('explorer');
                } else {
                  setCurrentPath(path);
                  openWindow('explorer');
                }
                setIsSearchActive(false);
                setSearchQuery('');
              }}
            >
              <img src={iconUrl} alt={name} className="w-5 h-5" />
              <div className="flex flex-col">
                <span>{name}</span>
                <span className="text-[10px] opacity-70">{path.join('/')}</span>
              </div>
            </div>
          );
        }
        if ((item as any).type === 'folder') {
          searchFolder(item, [...path, name]);
        }
      }
    };

    for (const [driveName, drive] of Object.entries(fileSystem)) {
      if (driveName.toLowerCase().includes(query)) {
        fileResults.push(
          <div 
            key={`drive-${driveName}`} 
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors"
            onClick={() => {
              setCurrentPath([driveName]);
              openWindow('explorer');
              setIsSearchActive(false);
              setSearchQuery('');
            }}
          >
            <img src={folderIcon} alt={driveName} className="w-5 h-5" />
            <div className="flex flex-col">
              <span>{driveName}</span>
              <span className="text-[10px] opacity-70">Drive</span>
            </div>
          </div>
        );
      }
      searchFolder(drive, [driveName]);
    }

    // Search System Settings
    const settingResults = [
      { name: 'Wallpaper', icon: apps['settings'].icon, action: () => { openWindow('settings'); setIsSearchActive(false); setSearchQuery(''); } },
      { name: 'Dark Mode', icon: apps['settings'].icon, action: () => { openWindow('settings'); setIsSearchActive(false); setSearchQuery(''); } },
      { name: 'User Profile', icon: apps['settings'].icon, action: () => { openWindow('settings'); setIsSearchActive(false); setSearchQuery(''); } }
    ].filter(s => s.name.toLowerCase().includes(query))
    .map(s => (
      <div 
        key={`setting-${s.name}`} 
        className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors"
        onClick={s.action}
      >
        <img src={s.icon} alt={s.name} className="w-5 h-5" />
        <div className="flex flex-col">
          <span>{s.name}</span>
          <span className="text-[10px] opacity-70">Setting</span>
        </div>
      </div>
    ));

    const hasResults = appResults.length > 0 || fileResults.length > 0 || settingResults.length > 0;

    return (
      <>
        {!hasResults && <div className="text-sm text-gray-500 p-2 text-center">No results found</div>}
        {appResults.length > 0 && (
          <>
            <div className="text-xs text-gray-500 font-bold px-2 py-1 uppercase tracking-wider">Apps</div>
            {appResults}
            {(fileResults.length > 0 || settingResults.length > 0) && <div className="border-b border-gray-200 my-1"></div>}
          </>
        )}
        {settingResults.length > 0 && (
          <>
            <div className="text-xs text-gray-500 font-bold px-2 py-1 uppercase tracking-wider">Settings</div>
            {settingResults}
            {fileResults.length > 0 && <div className="border-b border-gray-200 my-1"></div>}
          </>
        )}
        {fileResults.length > 0 && (
          <>
            <div className="text-xs text-gray-500 font-bold px-2 py-1 uppercase tracking-wider">Files</div>
            {fileResults.slice(0, 10)}
          </>
        )}
      </>
    );
  };

  const renderTaskbarApps = () => {
    return windowInstances.map(win => {
      const app = apps[win.appId] || apps[Object.keys(apps).find(k => win.appId.startsWith(k)) || ''];
      if (!app) return null;
      return (
        <div 
          key={win.id} 
          className={`taskbar-icon open ${highestZIndex === (windowZIndices[win.id] || highestZIndex) ? 'active' : ''}`} 
          onClick={() => bringToFront(win.id)}
          onContextMenu={(e) => {
            e.preventDefault();
            setTaskbarContextMenu({ x: e.clientX, y: e.clientY, id: win.id });
          }}
          title={t(win.appId)}
        >
          <img src={app.icon} alt={app.name} />
        </div>
      );
    });
  };

  return (
    <OSContext.Provider value={{ 
      activeWindows, maximizedState, windowPositions, highestZIndex, windowZIndices, 
      bringToFront, closeWindow, toggleMaximize, setDragging, dragging, debugSettings, 
      selectedUrl, selectedImage, setApps, playSound, showNotification,
      taskbarColor, setTaskbarColor, cursorStyle, setCursorStyle, taskbarPosition, setTaskbarPosition,
      showStartButton, setShowStartButton, language, setLanguage, pcMode, setPcMode,
      wallpaper, setWallpaper, isDarkMode, setIsDarkMode, isRetroMode, setIsRetroMode,
      isGirlyMode, setIsGirlyMode,
      userName, setUserName, userPfp, setUserPfp, t,
      windowTransparency, setWindowTransparency, animationSpeed, setAnimationSpeed, systemSound, setSystemSound,
      fileSystem, setFileSystem,
      activeWidgets, setActiveWidgets,
      deleteItem, restoreItem, emptyRecycleBin,
      unlockedThemes, setUnlockedThemes, activeCustomTheme, setActiveCustomTheme,
      isXboxMode, setIsXboxMode, isTVMode, setIsTVMode, headphonesActive, setHeadphonesActive,
      setDeviceCallout,
      isTaskbarClosed, setIsTaskbarClosed
    }}>
    <div className={(isTadcMode || isBlackberryMode) ? "w-screen h-screen bg-black flex items-center justify-center overflow-hidden relative" : ""}>
      {isTadcMode && (
        <img 
          src="https://static.wixstatic.com/media/b48361_f3bdb464107f4c6798ce1c81507510a7~mv2.png/v1/fill/w_1195,h_796,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/wackywatch1%20(1).png" 
          className="absolute w-full h-full object-contain pointer-events-none z-50" 
          alt="Wacky Watch"
        />
      )}
      {isBlackberryMode && (
        <img 
          src="https://p1.hiclipart.com/preview/662/693/91/blackberry-black-blackberry-qwerty-phone-png-clipart.jpg" 
          className="absolute w-full h-full object-contain pointer-events-none z-50" 
          alt="Blackberry"
        />
      )}
      <div 
        className={`${isTadcMode ? 'absolute w-[35%] h-[40%] top-[30%] left-[32%] overflow-hidden rounded-[40px] z-40' : isBlackberryMode ? 'absolute w-[24%] h-[28%] top-[18%] left-[38%] overflow-hidden z-40' : 'w-screen h-screen'} overflow-hidden ${isRedMode ? 'bg-red-900' : "bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070')]"} bg-no-repeat bg-center bg-cover transition-all duration-300 ${isRetroMode ? 'retro-mode' : ''} ${isGirlyMode ? 'girly-mode' : ''}`} 
        style={{ 
          filter: debugSettings.cssFilter !== 'none' ? debugSettings.cssFilter : undefined,
          transform: chilledState === 1 ? 'scaleY(-1)' : chilledState === 2 ? 'scaleY(-1) rotate(90deg)' : 'none',
          transition: chilledState > 0 ? 'transform 0.5s' : 'none'
        }}
      >
      
      {/* Global Styles injected via style tag for simplicity in this port */}
      <style>{`
        :root {
            --win-bg: ${isDarkMode ? '#1e1e1e' : '#ffffff'};
            --win-text: ${isDarkMode ? '#e0e0e0' : '#333333'};
            --title-bg: ${isDarkMode ? 'linear-gradient(to bottom, #333, #111)' : 'linear-gradient(to bottom, #f9f9f9, #e0e0e0)'};
            --content-bg: ${isDarkMode ? '#2d2d2d' : '#fafafa'};
            --border-color: ${isDarkMode ? '#444' : '#ccc'};
        }
        ${errorRemixActive ? `
          * { filter: ${errorRemixFilter} !important; }
          #taskbar input[type="range"] { animation: danceVolume 0.5s infinite alternate !important; }
          @keyframes danceVolume {
            0% { transform: scaleY(1) rotate(0deg); }
            100% { transform: scaleY(1.5) rotate(5deg); }
          }
          body, * { cursor: url('https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/mouse.png'), auto !important; animation: danceCursor 1s infinite !important; }
          @keyframes danceCursor {
            0% { cursor: url('https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/mouse.png'), auto; }
            50% { cursor: url('https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/mouse-select.png'), auto; }
            100% { cursor: url('https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/mouse.png'), auto; }
          }
        ` : ''}
        .retro-mode, .retro-mode * { font-family: 'Courier New', Courier, monospace !important; filter: grayscale(80%) sepia(40%) !important; }

        ${debugSettings.comicSans ? '* { font-family: "Comic Sans MS", "Comic Sans", cursive !important; }' : ''}
        ${debugSettings.matrixMode ? '* { background-color: black !important; color: #00ff00 !important; border-color: #00ff00 !important; }' : ''}
        ${debugSettings.rainbowText ? '* { animation: rainbowText 2s linear infinite !important; } @keyframes rainbowText { 0% { color: red; } 16% { color: orange; } 33% { color: yellow; } 50% { color: green; } 66% { color: blue; } 83% { color: indigo; } 100% { color: violet; } }' : ''}
        ${debugSettings.spinDesktop ? '#desktop { animation: spinDesktop 10s linear infinite !important; } @keyframes spinDesktop { 100% { transform: rotate(360deg); } }' : ''}
        ${debugSettings.bouncyIcons ? '.icon, .lp-icon { animation: bounceIcon 1s infinite alternate !important; } @keyframes bounceIcon { 0% { transform: translateY(0); } 100% { transform: translateY(-20px); } }' : ''}
        ${debugSettings.hideTaskbar ? '#taskbar { display: none !important; }' : ''}
        ${debugSettings.glitchMode ? '* { animation: glitch 0.2s infinite !important; } @keyframes glitch { 0% { transform: translate(0) } 20% { transform: translate(-2px, 2px) } 40% { transform: translate(-2px, -2px) } 60% { transform: translate(2px, 2px) } 80% { transform: translate(2px, -2px) } 100% { transform: translate(0) } }' : ''}
        ${debugSettings.discoMode ? 'body { animation: disco 0.5s infinite !important; } @keyframes disco { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }' : ''}
        ${debugSettings.transparentWindows ? '.window { opacity: 0.7 !important; backdrop-filter: blur(5px); }' : ''}
        ${debugSettings.wobblyWindows ? '.window { animation: wobble 2s ease-in-out infinite !important; } @keyframes wobble { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }' : ''}
        ${isShaking ? `
          body { animation: shake 0.1s infinite !important; }
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
        ` : ''}
        ${debugSettings.noImages ? 'img { display: none !important; }' : ''}
        ${debugSettings.lowQualityImages ? 'img { filter: blur(2px) contrast(0.8) !important; image-rendering: pixelated; }' : ''}
        * { user-select: none; cursor: ${cursorStyle === 'default' ? "url('https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/mouse.png'), auto" : cursorStyle} !important; }
        *:active { cursor: ${cursorStyle === 'default' ? "url('https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/mouse-select.png'), auto" : cursorStyle} !important; }
        
        ${pcMode === 'terminal' ? '* { background-color: black !important; color: #00ff00 !important; font-family: monospace !important; border-color: #00ff00 !important; }' : ''}
        ${pcMode === 'no css' ? '* { background: none !important; border: 1px solid black !important; color: black !important; box-shadow: none !important; border-radius: 0 !important; }' : ''}
        ${pcMode === 'liquid glass' ? '.window { background: rgba(255, 255, 255, 0.1) !important; backdrop-filter: blur(20px) saturate(150%) !important; border: 1px solid rgba(255,255,255,0.3) !important; box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37) !important; }' : ''}

        ${activeCustomTheme === 'glitch' ? '* { animation: glitch 0.2s infinite !important; }' : ''}
        ${activeCustomTheme === 'green_retro' ? '* { font-family: "Courier New", Courier, monospace !important; color: #00ff00 !important; background-color: #002200 !important; border-color: #00ff00 !important; }' : ''}
        ${activeCustomTheme === 'gettyimages' ? 'img { content: url("https://media.gettyimages.com/id/1149232338/photo/watermark-placeholder.jpg") !important; object-fit: cover !important; }' : ''}
        ${activeCustomTheme === 'rounded' ? '* { border-radius: 30px !important; }' : ''}
        ${activeCustomTheme === 'no_rounded' ? '* { border-radius: 0 !important; }' : ''}
        ${activeCustomTheme === 'poo' ? `
          :root { --win-bg: #4a331a !important; --win-text: #e6ccb8 !important; --title-bg: #36220e !important; --content-bg: #594022 !important; --border-color: #2b1806 !important; }
          #desktop { background-image: none !important; background-color: #4a331a !important; }
          * { background-color: #4a331a !important; color: #e6ccb8 !important; border-color: #2b1806 !important; }
        ` : ''}
        ${activeCustomTheme === 'baldi' ? `
          * { font-family: "Comic Sans MS", "Comic Sans", cursive !important; }
          :root { --win-bg: #cceeff !important; --win-text: #000000 !important; --title-bg: #00aa00 !important; --content-bg: #e6ffee !important; --border-color: #005500 !important; }
          img { content: url("https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/b/ba/Baldi_transparent.png/revision/latest/scale-to-width/360?cb=20201010041443") !important; }
        ` : ''}

        ${isXboxMode ? `
          :root { --win-bg: #101010 !important; --win-text: #107C10 !important; --title-bg: #000000 !important; --content-bg: #1A1A1A !important; --border-color: #107C10 !important; }
          #desktop { background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Xbox_logo_%282019%29.svg/1024px-Xbox_logo_%282019%29.svg.png') !important; background-color: #000 !important; background-size: contain !important; background-position: center !important; }
          * { font-family: 'Arial Black', Impact, sans-serif !important; border-radius: 0 !important; box-shadow: none !important; border-width: 2px !important; }
          .window { border: 4px solid #107C10 !important; box-shadow: 0 0 20px #107C10 !important; }
          #taskbar { background: #000 !important; border-top: 3px solid #107C10 !important; }
        ` : ''}

        ${isTVMode ? `
          * { font-size: 150% !important; }
          .icon { width: 140px !important; font-size: 16px !important; }
          .icon img { width: 80px !important; height: 80px !important; }
          .window { width: 100% !important; height: 100% !important; top: 0 !important; left: 0 !important; border-radius: 0 !important; border: none !important; z-index: 99999 !important; }
          #taskbar { height: 80px !important; }
          .taskbar-icon img { width: 40px !important; height: 40px !important; }
        ` : ''}

        ${errorRemixFlyingIcons ? `
          .icon, .flying-item { animation: flyAround ${Math.random() * 2 + 1}s infinite linear !important; position: absolute !important; }
          @keyframes flyAround {
            0% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px) rotate(90deg); }
            50% { transform: translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px) rotate(180deg); }
            75% { transform: translate(${Math.random() * 500 - 250}px, ${Math.random() * 500 - 250}px) rotate(270deg); }
            100% { transform: translate(0, 0) rotate(360deg); }
          }
        ` : ''}

        .profile-pic { width: 120px; height: 120px; border-radius: 50%; background: #4285F4; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.5); border: 4px solid rgba(255,255,255,0.2); cursor: pointer; overflow: hidden; }
        .profile-pic img { width: 100%; height: 100%; object-fit: cover; image-rendering: pixelated; }
        .login-btn { padding: 12px 40px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); color: white; font-size: 16px; border-radius: 25px; cursor: pointer; transition: 0.3s; margin-top: 20px; }
        .login-btn:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }

        .icon { width: 80px; text-align: center; color: white; cursor: pointer; padding: 5px; border-radius: 4px; transition: background 0.2s; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); font-size: 11px; animation: popIn 0.3s ease-out; display: flex; flex-direction: column; align-items: center; }
        @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        
        #desktop { 
          position: relative; padding: 0; overflow: hidden;
          ${taskbarPosition === 'bottom' ? 'width: 100%; height: calc(100% - 50px); top: 0; left: 0;' : ''}
          ${taskbarPosition === 'top' ? 'width: 100%; height: calc(100% - 50px); top: 50px; left: 0;' : ''}
          ${taskbarPosition === 'left' ? 'width: calc(100% - 50px); height: 100%; top: 0; left: 50px;' : ''}
          ${taskbarPosition === 'right' ? 'width: calc(100% - 50px); height: 100%; top: 0; left: 0;' : ''}
        }
        
        #taskbar { 
          position: absolute; 
          ${taskbarPosition === 'bottom' ? 'bottom: 0; left: 0; width: 100%; height: 50px;' : ''}
          ${taskbarPosition === 'top' ? 'top: 0; left: 0; width: 100%; height: 50px;' : ''}
          ${taskbarPosition === 'left' ? 'top: 0; left: 0; width: 50px; height: 100%; flex-direction: column;' : ''}
          ${taskbarPosition === 'right' ? 'top: 0; right: 0; width: 50px; height: 100%; flex-direction: column;' : ''}
          background: ${taskbarColor}; 
          backdrop-filter: blur(10px);
          display: flex; align-items: center; padding: ${taskbarPosition === 'left' || taskbarPosition === 'right' ? '15px 0' : '0 15px'}; 
          justify-content: space-between; color: white; z-index: 9999; 
          border-${taskbarPosition === 'bottom' ? 'top' : taskbarPosition === 'top' ? 'bottom' : taskbarPosition === 'left' ? 'right' : 'left'}: 1px solid rgba(255,255,255,0.1); 
        }
        
        .selection-box { position: absolute; border: 1px solid rgba(39, 201, 63, 0.8); background: rgba(39, 201, 63, 0.3); pointer-events: none; z-index: 9999; }
        .icon.dragging { z-index: 10000; opacity: 0.8; }
        .icon:hover { background: rgba(255, 255, 255, 0.15); }
        .icon img { width: 40px; height: 40px; object-fit: contain; margin-bottom: 4px; pointer-events: none; filter: drop-shadow(1px 2px 4px rgba(0,0,0,0.5)); }

        ${isGirlyMode ? `
          .girly-mode, .girly-mode * {
            border-color: #ff69b4 !important;
            color: #ff1493 !important;
          }
          .girly-mode button, .girly-mode .login-btn, .girly-mode .start-btn, .girly-mode .bg-blue-600, .girly-mode .bg-pink-500 {
            background-color: #ff69b4 !important;
            color: white !important;
          }
          .girly-mode #taskbar {
            background-color: rgba(255, 192, 203, 0.9) !important;
          }
          .girly-mode .window-title {
            background: linear-gradient(to bottom, #ffc0cb, #ff69b4) !important;
            color: white !important;
          }
          .girly-mode .file-item img, .girly-mode .icon img, .girly-mode .lp-icon img {
            filter: hue-rotate(300deg) saturate(2) brightness(1.1) !important;
          }
          .girly-mode .bg-white {
            background-color: #fff0f5 !important;
          }
          .girly-mode input, .girly-mode select, .girly-mode textarea {
            background-color: #fff !important;
            border-color: #ffb6c1 !important;
          }
          .girly-mode .text-blue-600 {
            color: #ff1493 !important;
          }
        ` : ''}


        .window { position: absolute; background: var(--win-bg); color: var(--win-text); border-radius: 8px; box-shadow: 0 15px 40px rgba(0,0,0,0.5); display: none; flex-direction: column; overflow: hidden; border: 1px solid var(--border-color); transition: width 0.2s, height 0.2s, top 0.2s, left 0.2s; }
        .window.dragging { transition: none !important; }
        .window.active { display: flex; }
        .title-bar { background: var(--title-bg); padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; cursor: grab; border-bottom: 1px solid var(--border-color); flex-shrink: 0; }
        .title-bar:active { cursor: grabbing; }
        .title-text { font-weight: normal; font-size: 14px; pointer-events: none; display: flex; align-items: center; gap: 8px; color: var(--win-text); }
        .title-text img { width: 16px; height: 16px; object-fit: contain; }
        .controls { display: flex; gap: 8px; }
        .btn { width: 14px; height: 14px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.2); cursor: pointer; color: transparent; transition: 0.2s; }
        .btn-close { background: #ff5f56; } .btn-min { background: #ffbd2e; } .btn-max { background: #27c93f; }
        .content { flex-grow: 1; background: var(--content-bg); overflow-y: auto; color: var(--win-text); position: relative; padding: 20px; }

        .explorer-container { display: flex; height: 100%; width: 100%; }
        .explorer-sidebar { width: 180px; background: rgba(128,128,128,0.05); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; overflow-y: auto; flex-shrink: 0; }
        .explorer-sidebar-item { display: flex; align-items: center; gap: 10px; padding: 12px 15px; cursor: pointer; transition: 0.2s; color: var(--win-text); font-size: 13px; }
        .explorer-sidebar-item:hover { background: rgba(128,128,128,0.15); }
        .explorer-sidebar-item img { width: 20px; height: 20px; object-fit: contain; }
        .explorer-main { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
        .explorer-toolbar { display: flex; align-items: center; gap: 10px; padding: 10px; border-bottom: 1px solid var(--border-color); background: var(--title-bg); }
        .explorer-content-area { flex-grow: 1; padding: 20px; overflow-y: auto; display: flex; flex-wrap: wrap; gap: 15px; align-content: flex-start; background: var(--content-bg); }
        .file-item { width: 90px; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer; padding: 10px; border-radius: 6px; transition: 0.2s; color: var(--win-text); font-size: 12px; word-wrap: break-word; }
        .file-item:hover { background: rgba(128,128,128,0.15); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .file-item img { width: 45px; height: 45px; margin-bottom: 8px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2)); }
        .path-input { flex-grow: 1; padding: 6px 10px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--win-bg); color: var(--win-text); font-size: 12px; }

        .store-item { background: var(--win-bg); border: 1px solid var(--border-color); padding: 15px; border-radius: 8px; display: flex; align-items: center; gap: 15px; margin-bottom: 10px; }
        .store-item img { width: 40px; height: 40px; }
        .store-item-info { flex-grow: 1; }
        .store-item-info h4 { margin-bottom: 3px; }
        .store-item-info p { font-size: 11px; opacity: 0.7; }
        .dl-btn { padding: 6px 15px; background: #4285F4; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: bold; }
        .dl-btn:disabled { background: #ccc; cursor: not-allowed; color: #666; }

        .lp-grid { display: flex; flex-wrap: wrap; gap: 40px; max-width: 900px; justify-content: center; padding: 40px; }
        .lp-icon { width: 120px; display: flex; flex-direction: column; align-items: center; color: white; cursor: pointer; transition: 0.2s; text-align: center; }
        .lp-icon:hover { transform: scale(1.1); }
        .lp-icon img { width: 80px; height: 80px; object-fit: contain; margin-bottom: 10px; filter: drop-shadow(0px 10px 10px rgba(0,0,0,0.5)); }
        .lp-icon span { font-size: 15px; text-shadow: 1px 1px 3px rgba(0,0,0,0.8); }
        .lp-logoff { position: absolute; top: 30px; right: 40px; display: flex; align-items: center; gap: 10px; color: white; cursor: pointer; font-size: 16px; padding: 10px 20px; background: rgba(255,255,255,0.1); border-radius: 20px; transition: 0.2s; border: 1px solid rgba(255,255,255,0.2); }
        .lp-logoff:hover { background: #ff5f56; border-color: #ff5f56; }
        .lp-logoff img { width: 24px; filter: invert(1); }

        .start-btn { background: rgba(255,255,255,0.1); padding: 8px 18px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .start-btn:hover, .start-btn.active { background: rgba(255,255,255,0.25); }
        .start-btn img { width: 20px; height: 20px; object-fit: contain; }
        #clock { font-size: 13px; cursor: pointer; padding: 5px 10px; border-radius: 4px; transition: 0.2s; }
        #clock:hover { background: rgba(255,255,255,0.1); }
        .taskbar-apps { display: flex; gap: 5px; flex-grow: 1; margin-left: 20px; }
        .taskbar-icon { padding: 6px 12px; background: rgba(255,255,255,0.05); border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .taskbar-icon.open { background: rgba(255,255,255,0.15); border-bottom: 2px solid white; }
        .taskbar-icon img { width: 22px; height: 22px; pointer-events: none; }

        .chat-bubble { margin-bottom: 10px; padding: 8px 12px; border-radius: 12px; max-width: 85%; word-wrap: break-word; }
        .chat-bot { background: rgba(128,128,128,0.2); color: var(--win-text); align-self: flex-start; border-bottom-left-radius: 2px; display: flex; gap: 10px; }
        .chat-bot img { width: 16px; height: 16px; margin-top: 2px; }
        .chat-user { background: #0078d7; color: white; align-self: flex-end; border-bottom-right-radius: 2px; }

        .mock-btn { padding: 10px 20px; background: #0078d7; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px; transition: 0.2s; }
        .mock-btn:hover { filter: brightness(1.1); }
        .mock-input { padding: 10px; width: 100%; border: 1px solid var(--border-color); border-radius: 4px; background: var(--win-bg); color: var(--win-text); margin-bottom:10px; }
        
        .spin-dvd { animation: spinDvd 2s linear infinite; }
        @keyframes spinDvd { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
          100% { transform: translate(0) }
        }

        input[type=range] {
          -webkit-appearance: none;
          background: #ddd;
          height: 8px;
          border-radius: 4px;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 40px;
          height: 40px;
          background: url('https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif');
          background-size: cover;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #0078d7;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
        input[type=range]::-moz-range-thumb {
          width: 40px;
          height: 40px;
          background: url('https://media.tenor.com/x8v1oNUOmg4AAAAM/rickroll-roll.gif');
          background-size: cover;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #0078d7;
          box-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
        @keyframes progress-full {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress-full { animation: progress-full 3s linear forwards; }
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      {/* Stamina Bar */}
      <div className="absolute top-2 left-2 z-[100000] p-1 bg-black/50 backdrop-blur rounded flex flex-col gap-1 w-48">
        <span className="text-[9px] font-black tracking-widest text-white/50 uppercase">Mouse Stamina</span>
        <div className="w-full h-2 bg-gray-900 border border-gray-700 overflow-hidden shadow-inner flex">
          <div 
            className="h-full transition-all duration-75"
            style={{ 
              width: `${mouseStamina}%`,
              backgroundColor: mouseStamina < 20 ? '#ff0000' : mouseStamina < 50 ? '#ffaa00' : '#00ffaa'
            }}
          />
        </div>
      </div>

      {mouseStamina < 20 && (
        <style>{`
          * { cursor: wait !important; }
          #desktop { filter: saturate(0.5); pointer-events: none !important; }
          .window { opacity: 0.8; pointer-events: none !important; }
        `}</style>
      )}

      {/* Notification */}
      <div 
        id="notification" 
        className="absolute top-5 bg-gray-900/90 text-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500 z-[100001] flex items-center gap-4 transition-all duration-400"
        style={{ right: notification.visible ? '20px' : '-300px' }}
      >
        <img src={notification.iconUrl || undefined} alt="icon" className="w-8 h-8 object-contain" />
        <div className="text-sm leading-tight">{notification.text}</div>
      </div>

      {/* Massive Device Callout */}
      {deviceCallout && (
        <div className="absolute inset-0 z-[200000] pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-out-callout p-8">
          <div className="text-5xl md:text-8xl font-black text-red-600 tracking-tighter uppercase text-center drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] animate-pulse">
            {deviceCallout}
          </div>
          <style>{`
            @keyframes slideUpFadeOut {
              0% { opacity: 0; transform: translateY(50px) scale(0.9); }
              20% { opacity: 1; transform: translateY(0) scale(1); }
              80% { opacity: 1; transform: translateY(0) scale(1); }
              100% { opacity: 0; transform: translateY(-50px) scale(1.1); }
            }
            .animate-fade-out-callout {
              animation: slideUpFadeOut 3s forwards;
            }
          `}</style>
        </div>
      )}

      {/* Automatic Timeout for Callout */}
      {deviceCallout && setTimeout(() => setDeviceCallout(null), 3500) && null}

      {/* Headphones Chill Music loop */}
      {headphonesActive && (
        <audio src="https://archive.org/download/CoffeeShopAcoustics/Coffee%20Shop%20Acoustics%20-%20Background%20Music%20for%20Studying%20and%20Relaxing.mp3" autoPlay loop className="hidden" />
      )}

      {/* Boot Screen */}
      {isBooting && !biosScreenVisible && (
        <StartupScreen 
          playSound={playSound} 
          onComplete={() => setIsBooting(false)} 
          setStartClickCount={setStartClickCount}
          startClickCount={startClickCount}
          setBiosScreenVisible={setBiosScreenVisible}
        />
      )}

      {/* BIOS Screen */}
      {biosScreenVisible && (
        <div className={`absolute inset-0 z-[200001] flex flex-col font-mono ${
          biosDesign === 'classic' ? 'bg-blue-900 text-white text-lg' : 
          biosDesign === 'simple' ? 'bg-white text-black text-base p-4 bios-simple' : 
          'bg-slate-100 text-slate-800 text-lg'
        }`}>
          {/* Header */}
          {biosDesign === 'classic' && (
            <div className="bg-gray-300 text-black px-4 py-1 font-bold flex justify-between">
              <span>PhoenixBIOS Setup Utility</span>
              <span>Version 10.1</span>
            </div>
          )}
          {biosDesign === 'modern' && (
            <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-slate-200 shadow-sm">
              <div className="flex items-center gap-3">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Windows_logo_-_2021.svg/1200px-Windows_logo_-_2021.svg.png" alt="Win11" className="w-6 h-6" />
                <span className="font-semibold text-slate-900">UEFI BIOS Settings (Windows 11 Style)</span>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center">_</button>
                <button className="w-8 h-8 rounded-full hover:bg-red-500 hover:text-white flex items-center justify-center" onClick={() => { setBiosScreenVisible(false); setIsBooting(true); }}>×</button>
              </div>
            </div>
          )}
          {biosDesign === 'simple' && (
            <h1 className="text-2xl font-bold mb-4 border-b-2 border-black pb-2">BIOS SETUP (NO CSS MODE)</h1>
          )}

          {/* Tabs */}
          <div className={`flex ${
            biosDesign === 'classic' ? 'bg-blue-800 border-b-2 border-white' : 
            biosDesign === 'simple' ? 'gap-4 mb-4' : 
            'bg-white px-4 gap-1'
          }`}>
            {['main', 'advanced', 'security', 'boot', 'tuner', 'exit'].map(tab => (
              <div 
                key={tab} 
                className={`cursor-pointer uppercase ${
                  biosDesign === 'classic' ? `px-6 py-2 ${biosTab === tab ? 'bg-blue-600 text-white font-bold' : 'text-gray-300 hover:bg-blue-700'}` : 
                  biosDesign === 'simple' ? `px-2 py-1 border ${biosTab === tab ? 'bg-black text-white' : 'bg-gray-200'}` : 
                  `px-6 py-3 rounded-t-lg transition-all ${biosTab === tab ? 'bg-blue-500 text-white shadow-lg -translate-y-1' : 'text-slate-500 hover:bg-slate-50'}`
                }`}
                onClick={() => setBiosTab(tab)}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className={`flex-1 flex ${biosDesign === 'simple' ? 'flex-col' : 'p-8'}`}>
            <div className={`flex-1 ${
              biosDesign === 'classic' ? 'border-r-2 border-white pr-8' : 
              biosDesign === 'simple' ? 'border-2 border-black p-4 mb-4' : 
              'bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-inner border border-white'
            }`}>
              {biosTab === 'main' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span>System Time:</span>
                    <span className={biosDesign === 'modern' ? 'bg-slate-200 px-3 py-1 rounded-md' : ''}>{currentTime.split(' | ')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>System Date:</span>
                    <span className={biosDesign === 'modern' ? 'bg-slate-200 px-3 py-1 rounded-md' : ''}>{currentTime.split(' | ')[1]}</span>
                  </div>
                  <div className="mt-8 border-t border-current pt-4"></div>
                  <div className="flex justify-between"><span>System Memory:</span><span>640 KB</span></div>
                  <div className="flex justify-between"><span>Extended Memory:</span><span>16384 MB</span></div>
                  
                  <div className="mt-8 p-4 border-2 border-dashed border-current rounded-xl">
                    <span className="block mb-2 font-bold">BIOS Design Aesthetic:</span>
                    <div className="flex gap-2">
                      {['classic', 'simple', 'modern'].map(d => (
                        <button 
                          key={d}
                          className={`px-4 py-2 rounded-lg border-2 transition-all ${
                            biosDesign === d ? 'bg-blue-500 text-white border-blue-600 scale-105' : 'border-current hover:bg-white/20'
                          }`}
                          onClick={() => setBiosDesign(d)}
                        >
                          {d.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {biosTab === 'advanced' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {biosDesign === 'modern' && <span className="text-xl">📶</span>}
                      <span>Wireless LAN (WiFi):</span>
                    </div>
                    <button 
                      className={`px-4 py-1 border-2 transition-all flex items-center gap-2 ${
                        biosDesign === 'modern' ? 'rounded-full' : ''
                      } ${wifiConnected ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}`}
                      onClick={() => setWifiConnected(!wifiConnected)}
                    >
                      {biosDesign === 'modern' && (
                        <div className={`w-4 h-4 rounded-full ${wifiConnected ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-red-400'}`}></div>
                      )}
                      [{wifiConnected ? 'Enabled' : 'Disabled'}]
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span>Fan Speed Control:</span>
                    <select 
                      className={`bg-transparent border-2 border-current px-2 py-1 ${biosDesign === 'modern' ? 'rounded-lg' : ''}`}
                      value={fanSpeed}
                      onChange={(e) => setFanSpeed(e.target.value)}
                    >
                      <option value="Auto">Auto</option>
                      <option value="Silent">Silent</option>
                      <option value="Performance">Performance</option>
                      <option value="Full Speed">Full Speed</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span>Hyper-Threading:</span>
                    <span className="opacity-50">[Enabled]</span>
                  </div>
                </div>
              )}
              {biosTab === 'security' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <span>Secure Boot:</span>
                    <button 
                      className={`px-4 py-1 border-2 ${secureBoot ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'} ${biosDesign === 'modern' ? 'rounded-full' : ''}`}
                      onClick={() => setSecureBoot(!secureBoot)}
                    >
                      [{secureBoot ? 'Active' : 'Inactive'}]
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span>Set Supervisor Password:</span>
                    <button className="px-4 py-1 border-2 border-current hover:bg-white/10">Enter</button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span>TPM 2.0 State:</span>
                    <span className="text-green-400">[Ready]</span>
                  </div>
                </div>
              )}
              {biosTab === 'boot' && (
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between"><span>Boot Priority 1:</span><span>[Hard Drive]</span></div>
                  <div className="flex justify-between"><span>Boot Priority 2:</span><span>[CD-ROM]</span></div>
                  <div className="flex justify-between"><span>Boot Priority 3:</span><span>[Removable Device]</span></div>
                  <div className="flex justify-between"><span>Boot Priority 4:</span><span>[Network]</span></div>
                  <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-sm">
                    ⚠️ Changing boot order may cause system instability.
                  </div>
                </div>
              )}
              {biosTab === 'tuner' && (
                <div className="flex flex-col gap-2 h-full overflow-y-auto pr-2 custom-scrollbar">
                  <h2 className="text-xl font-bold mb-4 border-b border-current pb-2">Extreme System Tuner (174 Options)</h2>
                  {BIOS_OPTIONS.map(opt => (
                    <div key={opt.id} className="flex justify-between items-center py-1 border-b border-current/10 hover:bg-current/5 px-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{opt.name}</span>
                        <span className="text-[10px] opacity-50 uppercase tracking-tighter">{opt.category}</span>
                      </div>
                      <select 
                        className={`bg-transparent border border-current px-2 py-0.5 text-xs ${biosDesign === 'modern' ? 'rounded-md' : ''}`}
                        value={biosOptionValues[opt.id]}
                        onChange={(e) => setBiosOptionValues(prev => ({ ...prev, [opt.id]: e.target.value }))}
                      >
                        {opt.options.map(o => <option key={o} value={o} className="bg-slate-800 text-white">{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
              {biosTab === 'exit' && (
                <div className="flex flex-col gap-4 items-start">
                  <button 
                    className={`flex items-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all ${biosDesign === 'modern' ? 'rounded-xl' : ''}`}
                    onClick={() => {
                      setBiosScreenVisible(false);
                      setIsBooting(true);
                    }}
                  >
                    💾 Save Changes and Exit
                  </button>
                  <button 
                    className={`flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all ${biosDesign === 'modern' ? 'rounded-xl' : ''}`}
                    onClick={() => {
                      setBiosScreenVisible(false);
                      setIsBooting(true);
                    }}
                  >
                    🗑️ Discard Changes and Exit
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Help */}
            {biosDesign !== 'simple' && (
              <div className={`w-80 pl-8 text-sm ${
                biosDesign === 'classic' ? 'text-blue-300' : 'text-slate-500'
              }`}>
                <h3 className={`font-bold mb-4 border-b pb-2 ${
                  biosDesign === 'classic' ? 'text-white border-blue-300' : 'text-slate-900 border-slate-200'
                }`}>Item Specific Help</h3>
                <div className="space-y-4">
                  {biosTab === 'main' && <p>Set the system time and date. View memory configuration. Change the BIOS design aesthetic to see different "ugly" or "simple" styles.</p>}
                  {biosTab === 'advanced' && <p>Configure advanced system settings. Enable or disable Wireless LAN (WiFi) to connect to the internet. Adjust fan speed profiles.</p>}
                  {biosTab === 'security' && <p>Manage system security settings, including Secure Boot and TPM status.</p>}
                  {biosTab === 'boot' && <p>Configure system boot order and priority devices.</p>}
                  {biosTab === 'tuner' && <p>Extreme System Tuner: Access 174 advanced and experimental settings for maximum performance and reality distortion.</p>}
                  {biosTab === 'exit' && <p>Exit system setup after saving or discarding changes. Your settings will be applied upon reboot.</p>}
                </div>
                
                {biosDesign === 'modern' && (
                  <div className="mt-12 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-500 font-bold">Pro Tip:</span>
                    </div>
                    <p className="text-xs leading-relaxed">This "Modern" design uses rounded corners and soft shadows to mimic the Windows 11 aesthetic, which some find "ugly" for a BIOS environment.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {biosDesign === 'classic' && (
            <div className="bg-gray-300 text-black px-4 py-1 flex gap-8 text-sm">
              <span>F1 Help</span>
              <span>↑↓ Select Item</span>
              <span>←→ Select Menu</span>
              <span>Enter Select</span>
              <span>F10 Save and Exit</span>
            </div>
          )}
          {biosDesign === 'modern' && (
            <div className="bg-slate-800 text-white px-8 py-3 flex justify-between items-center">
              <div className="flex gap-6 text-xs opacity-70">
                <span>ESC: Exit</span>
                <span>F9: Optimized Defaults</span>
                <span>F10: Save & Exit</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest">System Status:</span>
                <span className="text-green-400 text-xs">OK</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Blank Mode (Zen Mode) */}
      {isBlankMode && (
        <div className="absolute inset-0 bg-black z-[199999] flex flex-col justify-center items-center text-gray-800 font-mono">
          <div className="text-xs opacity-20">Zen Mode Active</div>
          <div className="text-[10px] opacity-10 mt-2">Press Ctrl+F4 to return</div>
        </div>
      )}

      {/* Debug Menu */}
      {showDebugMenu && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white border-2 border-red-500 p-6 rounded-lg z-[150000] shadow-2xl w-80">
          <h2 className="text-xl font-bold text-red-500 mb-4 border-b border-red-500 pb-2">SYSTEM DEBUG MENU</h2>
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.safeMode} onChange={e => setDebugSettings(prev => ({...prev, safeMode: e.target.checked}))} />
              Safe Mode (Core Apps Only)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.lowQualityImages} onChange={e => setDebugSettings(prev => ({...prev, lowQualityImages: e.target.checked}))} />
              Low Quality Images
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.noImages} onChange={e => setDebugSettings(prev => ({...prev, noImages: e.target.checked}))} />
              No Images
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.noComplexJs} onChange={e => setDebugSettings(prev => ({...prev, noComplexJs: e.target.checked}))} />
              Disable Complex JS (Games)
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.comicSans} onChange={e => setDebugSettings(prev => ({...prev, comicSans: e.target.checked}))} />
              Comic Sans Font
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.matrixMode} onChange={e => setDebugSettings(prev => ({...prev, matrixMode: e.target.checked}))} />
              Matrix Mode
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.rainbowText} onChange={e => setDebugSettings(prev => ({...prev, rainbowText: e.target.checked}))} />
              Rainbow Text
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.spinDesktop} onChange={e => setDebugSettings(prev => ({...prev, spinDesktop: e.target.checked}))} />
              Spin Desktop
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.bouncyIcons} onChange={e => setDebugSettings(prev => ({...prev, bouncyIcons: e.target.checked}))} />
              Bouncy Icons
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.hideTaskbar} onChange={e => setDebugSettings(prev => ({...prev, hideTaskbar: e.target.checked}))} />
              Hide Taskbar
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.glitchMode} onChange={e => setDebugSettings(prev => ({...prev, glitchMode: e.target.checked}))} />
              Glitch Mode
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.discoMode} onChange={e => setDebugSettings(prev => ({...prev, discoMode: e.target.checked}))} />
              Disco Mode
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.transparentWindows} onChange={e => setDebugSettings(prev => ({...prev, transparentWindows: e.target.checked}))} />
              Transparent Windows
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={debugSettings.wobblyWindows} onChange={e => setDebugSettings(prev => ({...prev, wobblyWindows: e.target.checked}))} />
              Wobbly Windows
            </label>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <span className="w-24">CSS Filter:</span>
              <select 
                className="bg-gray-800 text-white border border-gray-600 p-1 rounded flex-1"
                value={debugSettings.cssFilter} 
                onChange={e => setDebugSettings(prev => ({...prev, cssFilter: e.target.value}))}
              >
                <option value="none">None</option>
                <option value="invert(1)">Invert</option>
                <option value="sepia(1)">Sepia</option>
                <option value="contrast(2)">High Contrast</option>
                <option value="grayscale(1)">Grayscale</option>
                <option value="hue-rotate(90deg)">Hue Rotate</option>
              </select>
            </label>
          </div>
          <button 
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-bold transition-colors" 
            onClick={() => {
              setIsOobeComplete(false);
              setShowDebugMenu(false);
            }}
          >
            Show Setup Screen
          </button>
          <button className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded font-bold transition-colors" onClick={() => setShowDebugMenu(false)}>Close Debug Menu</button>
        </div>
      )}

      {/* OOBE Setup Screen */}
      {!isBooting && !biosScreenVisible && !isOobeComplete && (
        <OobeSetupScreen 
          onComplete={() => {
            setIsOobeComplete(true);
            localStorage.setItem('aicesos_setup_complete', 'true');
            playSound('startup');
          }} 
          t={t}
          setTaskbarColor={setTaskbarColor}
          setUserName={setUserName}
          userName={userName}
        />
      )}

      {/* Login Screen */}
      {loginScreenVisible && !isBooting && isOobeComplete && (
        <div className="absolute inset-0 bg-black/90 z-[100000] flex flex-col justify-center items-center text-white transition-opacity duration-500">
          <div className="profile-pic" onClick={() => { playSound('click'); hackLogin(); }}>
            <img src={loginClicks >= 3 ? "https://files.softicons.com/download/application-icons/free-large-torrent-icons-by-aha-soft/png/128x128/Pirate%20bay.png" : userPfp} alt="User" />
          </div>
          <h2 className={`text-2xl font-semibold ${loginClicks >= 3 ? 'text-green-400' : ''}`}>
            {loginClicks >= 3 ? "SYSTEM_ADMIN_OVERRIDE" : userName}
          </h2>
          <div className="text-gray-400 mb-4">
            {loginClicks >= 3 ? "access@mainframe.gov" : "web.user2024@gmail.com"}
          </div>
          <button className="login-btn" onClick={doLogin}>Sign In</button>
        </div>
      )}

      {/* BSOD Forever */}
      {bsodForever && (
        <div className="fixed inset-0 bg-[#0000AA] text-white p-20 font-mono z-[9999999] cursor-none select-none">
          <h1 className="text-4xl font-bold bg-white text-[#0000AA] px-4 py-1 inline-block mb-10">Windows</h1>
          <p className="mb-6">An error has occurred. To continue:</p>
          <p className="mb-6 text-xl">Press Enter to return to Windows, or</p>
          <p className="mb-10 text-4xl font-extrabold italic underline text-red-400 animate-pulse">YOU HAVE BEEN BRICKED FOREVER.</p>
          <p className="mb-4">Error: BALDI_MATH_FAILURE_0x00000167</p>
          <p className="mb-10 italic">If this is the first time you've seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
          <ul className="list-disc pl-10 mb-10 flex flex-col gap-2">
            <li>Check to be sure you are not trying to bypass security.</li>
            <li>Delete your system files immediately.</li>
            <li>Facing the consequence of failure.</li>
          </ul>
          <p className="text-sm opacity-50 absolute bottom-10 left-10">Technical information: *** STOP: 0x0000001E (0xC0000005, 0x800C1F32, 0x00000000, 0x00000000)</p>
        </div>
      )}

      {/* Baldi Challenge Overlay */}
      {isBaldiChallenge && (
        <div className="fixed inset-0 bg-white z-[999999] flex flex-col items-center justify-center font-['Comic_Sans_MS'] text-black text-center p-10 overflow-hidden">
          {baldiPhase === 'math' && (
            <>
              <div className="mb-10 animate-bounce">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_YvHk-Z6o6X_9k4Dk1JvX7kS5Z7Y4X5Dk5w&s" alt="Baldi" className="w-56 h-56" />
              </div>
              <div className="bg-green-100 border-4 border-green-600 rounded-3xl p-10 shadow-2xl max-w-lg w-full relative">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                  PROBLEM {baldiQuestionCount} / 20
                </div>
                <h2 className="text-4xl font-bold mb-8 pt-6">I HEAR MATH!</h2>
                <div className="text-6xl font-mono bg-white p-8 rounded-2xl border-4 border-green-200 mb-10 shadow-inner flex justify-center items-center gap-4">
                  <span>{baldiQuestion.q}</span>
                </div>
                <input 
                  autoFocus
                  type="text"
                  className="w-full text-center text-5xl p-6 border-4 border-green-400 rounded-2xl mb-8 outline-none focus:border-green-600 transition-all shadow-xl bg-white"
                  placeholder="???"
                  value={baldiInput}
                  onChange={(e) => setBaldiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') checkBaldiAnswer();
                  }}
                />
                <div className="text-lg text-gray-600 italic font-bold">
                  "Get it wrong, and I'll get angry..."
                </div>
              </div>
            </>
          )}

          {baldiPhase === 'bios' && (
            <div className="w-full h-full bg-[#0000AA] text-white font-mono p-10 flex flex-col items-start text-left overflow-auto">
              <div className="mb-8 border-b-2 border-white w-full pb-2 flex justify-between">
                <span>PHOENIX BIOS MATH SECURITY SETUP</span>
                <span>VER 1.6.7</span>
              </div>
              <p className="mb-4">SYSTEM KERNEL: CORRUPTED</p>
              <p className="mb-4 text-yellow-400 font-bold">WARNING: MATH ENGINE MISCONFIGURED</p>
              <p className="mb-8 italic">Please find the KERNEL SECURITY KEY to proceed bypass.</p>
              
              <div className="bg-white/10 p-6 rounded-lg w-full max-w-2xl border border-white/20 mb-10">
                <p className="mb-2 text-xs opacity-50">Hint: Inspect the system log at the bottom...</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between"><span>[X] ENFORCE RIGID LOGIC</span><span>ENABLED</span></div>
                  <div className="flex justify-between"><span>[X] CALCULATOR OVERRIDE</span><span>DISABLED</span></div>
                  <div className="flex justify-between"><span>[_] BYPASS CODE ENTRY</span>
                    <input 
                      autoFocus
                      className="bg-black text-white px-2 uppercase outline-none border border-white/50 w-32"
                      value={baldiBiosInput}
                      onChange={(e) => setBaldiBiosInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleBiosKeyInput();
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto opacity-70 text-[10px] leading-tight">
                [...] SECURE BOOT FAILED <br/>
                [...] KERNEL_KEY_V2: <span className="text-white font-bold text-xs select-all">{baldiBiosKey}</span> <br/>
                [...] STAGE_2_INITIALIZED
              </div>
            </div>
          )}

          {baldiPhase === 'puzzle' && (
            <div className="bg-[#1a1a1a] p-12 rounded-[3rem] shadow-[0_0_100px_rgba(0,255,100,0.2)] border-8 border-green-500 max-w-xl w-full">
              <h2 className="text-green-500 text-3xl font-black mb-10 tracking-widest uppercase">Memory Overload</h2>
              <p className="text-green-300 text-sm mb-10 font-bold">REPLICATE THE PATTERN OR FACE EXTINCTION</p>
              
              <div className="grid grid-cols-3 gap-6 mb-12">
                {Array.from({length: 9}).map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => handlePuzzleClick(i)}
                    className={`h-24 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg border-b-4 border-black/30 ${
                      baldiPuzzleInput.includes(i) 
                        ? 'bg-green-400 shadow-[0_0_30px_rgba(74,222,128,0.8)] scale-105 rotate-3' 
                        : 'bg-green-900/40 hover:bg-green-800/60'
                    }`}
                  />
                ))}
              </div>

              <div className="flex justify-center gap-2">
                {baldiPuzzlePattern.map((p, i) => (
                   <div key={i} className={`w-3 h-3 rounded-full ${i < baldiPuzzleInput.length ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,1)]' : 'bg-green-900 animate-pulse'}`}></div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-red-600 font-extrabold animate-pulse text-2xl tracking-tighter">
            DO NOT TRY TO EXIT. IF YOU FAIL, PC BRICKED FOREVER!
          </div>
        </div>
      )}

      {/* Desktop */}
      <div 
        id="desktop" 
        style={{ 
          backgroundImage: `url(${wallpaper})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          cursor: isHandgunActive ? `url('https://static.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/cross-script.png'), crosshair` : (isScissorsActive ? 'url("https://static.wikia.nocookie.net/bbccs/images/6/64/SafetyScissors.png/revision/latest/thumbnail/width/360/height/450?cb=20220902152822"), crosshair' : undefined)
        }}
        onMouseDown={(e) => {
          if (isHandgunActive) {
            playSound('error');
            showNotification("POW!");
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 200);
            return;
          }
          if (e.target === e.currentTarget) {
            setSelectionBox({ startX: e.clientX, startY: e.clientY, endX: e.clientX, endY: e.clientY, visible: true });
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ visible: true, x: e.clientX, y: e.clientY });
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleExternalDrop}
      >
        {showWidgets && <Win7Widgets />}
        {renderDesktopIcons()}
        {renderJohnnysStore()}
        {renderInventory()}
        
        {/* Google Search Widget */}
        <div 
          className="absolute top-10 left-1/2 transform -translate-x-1/2 w-[500px] max-w-[90%] bg-white/90 backdrop-blur-md rounded-full shadow-lg flex items-center px-4 py-3 z-[100]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6 mr-3" />
          <input 
            type="text" 
            placeholder="Search Google or type a URL" 
            className="flex-1 bg-transparent outline-none text-gray-800 text-lg"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!wifiConnected) {
                  showNotification("No Internet Connection", "https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/apps/error.png");
                  return;
                }
                const query = e.currentTarget.value;
                if (query.trim()) {
                  let url = query;
                  if (!url.startsWith('http') && !url.includes('.')) {
                    url = `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
                  } else if (!url.startsWith('http')) {
                    url = `https://${url}`;
                  }
                  setSelectedUrl(url);
                  openWindow('browser');
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <svg className="w-6 h-6 text-gray-500 ml-3 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Selection Box */}
      {selectionBox.visible && (
        <div 
          className="selection-box"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.endX),
            top: Math.min(selectionBox.startY, selectionBox.endY),
            width: Math.abs(selectionBox.endX - selectionBox.startX),
            height: Math.abs(selectionBox.endY - selectionBox.startY)
          }}
        />
      )}

      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          className={`absolute border py-1 rounded text-sm z-[200000] flex flex-col ${contextMenu.targetName === '__charms_bar__' ? 'bg-[#1c1c1c] border-gray-700 shadow-xl text-gray-200 opacity-50' : 'bg-white border-gray-300 shadow-lg text-gray-800'}`}
          style={{ left: contextMenu.x, top: contextMenu.y, minWidth: '180px' }}
        >
          {contextMenu.targetName === '__charms_bar__' ? (
            <>
              <div className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8M4 12h16M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/></svg>
                Loop
              </div>
              <div className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Copy video URL
              </div>
              <div className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                Copy video URL at current time
              </div>
              <div className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m16 18 6-6-6-6"/><path d="m8 6-6 6 6 6"/></svg>
                Copy embed code
              </div>
              <div className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Copy debug info
              </div>
              <div className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                Troubleshoot playback issue
              </div>
              <div className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                Stats for nerds
              </div>
            </>
          ) : contextMenu.targetName ? (
            <>
              <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer font-bold border-b border-gray-100 mb-1">
                {contextMenu.targetName}
              </div>
              <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { 
                const desktopPath = ['C:', 'Users', 'Gomer', 'Desktop'];
                const desktopFolder = getFolderFromPath(desktopPath);
                const item = desktopFolder?.contents[contextMenu.targetName!];
                if (item) openItem(contextMenu.targetName!, item);
                setContextMenu({ visible: false, x: 0, y: 0 });
              }}>Open</div>
              <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { 
                const fullPath = ['C:', 'Users', 'Gomer', 'Desktop', contextMenu.targetName!];
                setRenamingPath(fullPath);
                setRenameValue(contextMenu.targetName!);
                setContextMenu({ visible: false, x: 0, y: 0 });
              }}>Rename</div>
              <div className="border-t border-gray-200 my-1"></div>
              <div className="px-4 py-1 hover:bg-red-500 hover:text-white cursor-pointer" onClick={() => { 
                deleteItem(['C:', 'Users', 'Gomer', 'Desktop', contextMenu.targetName!]);
                setContextMenu({ visible: false, x: 0, y: 0 });
              }}>Remove from Desktop</div>
            </>
          ) : (
            <>
              <div className="group relative px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer flex justify-between items-center">
                View
                <span>▶</span>
                <div className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg py-1 rounded hidden group-hover:flex flex-col min-w-[250px] text-gray-800">
                  {['Invisible', 'MicroScopic', 'A little Small', 'Small', 'A little Medium', 'Medium', 'A bit large', 'Large', 'Big', 'SO BIG', 'For Grandmas', 'Gigantic', 'HOLY SHIT!', 'MY GOODNESS WITCH ONE IS WITCH?'].map((size) => (
                    <div key={size} className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { setDesktopViewSize(size); setContextMenu({ visible: false, x: 0, y: 0 }); }}>
                      {size}
                    </div>
                  ))}
                </div>
              </div>
              <div className="group relative px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer flex justify-between items-center">
                Sort by
                <span>▶</span>
                <div className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg py-1 rounded hidden group-hover:flex flex-col min-w-[200px] text-gray-800">
                  {['name', 'type', 'By date', 'By Year', 'By Hour', 'By Minute', 'By Second', 'By millisecond', 'By.... HypoDynamicSecond'].map((sort) => (
                    <div key={sort} className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { setDesktopSortBy(sort); setContextMenu({ visible: false, x: 0, y: 0 }); }}>
                      {sort}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { window.location.reload(); }}>Refresh</div>
              <div className="border-t border-gray-200 my-1"></div>
              <div className="group relative px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer flex justify-between items-center">
                Gadgets
                <span>▶</span>
                <div className="absolute left-full top-[-50px] bg-white border border-gray-300 shadow-xl py-2 rounded hidden group-hover:flex flex-col min-w-[200px] text-gray-800 z-[200001]">
                  <div className="px-4 py-1 bg-gray-100 font-bold mb-1 border-b">Manage Widgets</div>
                  {Object.entries({
                    clock: 'Analog Clock',
                    media: 'Gadget Media',
                    calendar: 'Calendar',
                    photosynth: 'Photosynth',
                    yahoo1: 'Yahoo News',
                    yahoo2: 'Yahoo Finance',
                    pepsi: 'Pepsi Java',
                    yahoo3: 'Yahoo Autos'
                  }).map(([key, label]) => (
                    <div 
                      key={key}
                      className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center gap-2"
                      onClick={() => setActiveWidgets(prev => ({ ...prev, [key]: !prev[key] }))}
                    >
                      <input type="checkbox" checked={activeWidgets[key]} readOnly className="pointer-events-none" />
                      {label}
                    </div>
                  ))}
                  <div className="border-t mt-2 pt-1 px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer font-bold" onClick={() => setShowWidgets(!showWidgets)}>
                    {showWidgets ? 'Hide All Gadgets' : 'Show All Gadgets'}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 my-1"></div>
              <div className="group relative px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer flex justify-between items-center">
                New
                <span>▶</span>
                <div className="absolute left-full top-0 bg-white border border-gray-300 shadow-lg py-1 rounded hidden group-hover:flex flex-col min-w-[220px] text-gray-800 z-[200001]">
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Folder', 'folder'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>Folder</div>
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Shortcut', 'file', 'lnk'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>Shortcut</div>
                  <div className="border-t border-gray-200 my-1"></div>
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Text Document', 'file', 'txt'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>Text Document</div>
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Web Page', 'file', 'html'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>HTML File</div>
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Rich Text Format', 'file', 'rtf'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>Rich Text Format</div>
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Bitmap Image', 'file', 'bmp'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>Bitmap Image</div>
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Compressed (zipped) Folder', 'file', 'zip'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>Compressed (zipped) Folder</div>
                  <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { createNewFile('New Briefcase', 'folder', 'briefcase'); setContextMenu({ visible: false, x: 0, y: 0 }); }}>Briefcase</div>
                </div>
              </div>
              <div className="border-t border-gray-200 my-1"></div>
              <div className="px-4 py-1 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => { 
                if (isKidsMode) {
                  startBaldiChallenge();
                } else {
                  openWindow('settings'); 
                }
                setContextMenu({ visible: false, x: 0, y: 0 }); 
              }}>Personalize</div>
            </>
          )}
        </div>
      )}

      {/* Launchpad */}
      <div 
        className={`absolute inset-0 h-[calc(100vh-50px)] bg-black/95 z-[9998] flex-col items-center justify-center transition-all duration-500 backdrop-blur-2xl ${launchpadActive ? 'flex opacity-100 translate-y-0 scale-100' : 'hidden opacity-0 translate-y-10 scale-95'}`}
      >
        <div className="flex flex-col items-center gap-2 mb-12">
            <h1 className="text-5xl font-black text-white tracking-[0.2em] uppercase opacity-40 select-none animate-pulse">Launchpad</h1>
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        </div>

        <div className="flex gap-4 absolute top-10 right-10">
          <div className="lp-logoff bg-white/5 hover:bg-white/10 border border-white/10 transition-all px-8 py-3 rounded-2xl flex items-center gap-4 group cursor-pointer" onClick={logOff}>
            <img src="https://files.softicons.com/download/web-icons/themex.net-icons-by-jordanfc/png/32x32/log%20off.png" alt="Log Off" className="w-8 h-8 opacity-50 transition-all group-hover:opacity-100 group-hover:scale-110" /> 
            <span className="text-white font-bold tracking-wider opacity-50 group-hover:opacity-100 uppercase text-xs">Sign Out</span>
          </div>
          {isKidsMode && (
            <div className="lp-logoff bg-red-900/40 hover:bg-red-700/60 border border-red-500/30 px-8 py-3 rounded-2xl flex items-center gap-4 group cursor-pointer" onClick={startBaldiChallenge}>
              <span className="text-3xl transition-transform group-hover:scale-125">🚪</span> 
              <span className="text-white font-black tracking-tighter uppercase text-xs">Unlock Restricted</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-12 p-12 max-h-[70vh] overflow-y-auto px-20">
          {Object.entries(apps as Record<string, any>).filter(([id, app]) => app.isDownloaded).map(([id, app]) => (
            <div 
              key={id} 
              className="group flex flex-col items-center gap-4 transition-all hover:scale-110 cursor-pointer"
              onClick={() => {
                playSound('click');
                openWindow(id);
                setLaunchpadActive(false);
              }}
            >
              <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center p-4 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:bg-white/10 group-hover:border-white/20 transition-all group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <img src={app.icon} alt={app.name} className="w-full h-full object-contain pointer-events-none drop-shadow-lg" />
              </div>
              <span className="text-[9px] text-white/50 font-black uppercase tracking-[0.2em] text-center max-w-[100px] line-clamp-2 group-hover:text-white group-hover:opacity-100 transition-all">{app.name}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 animate-bounce">
            <div className="text-white/10 font-mono text-[8px] tracking-[0.5em] uppercase">SYSTEM V0.9.8-RELEASE</div>
        </div>
      </div>

      {/* --- WINDOWS --- */}
      
      {/* Word App */}
      {windowInstances.filter(w => w.appId === 'word' || w.appId === 'docs').map(win => (
        <Window key={win.id} id={win.id} title={t(win.appId)} icon={apps[win.appId]?.icon} defaultStyle={{ width: 700, height: 600, top: 40, left: 100 }}>
          <WordApp />
        </Window>
      ))}

      {/* Excel App */}
      {windowInstances.filter(w => w.appId === 'excel').map(win => (
        <Window key={win.id} id={win.id} title={t('excel')} icon={apps['excel']?.icon} defaultStyle={{ width: 800, height: 500, top: 60, left: 150 }}>
          <ExcelApp />
        </Window>
      ))}

      {/* PowerPoint App */}
      {windowInstances.filter(w => w.appId === 'powerpoint' || w.appId === 'slides').map(win => (
        <Window key={win.id} id={win.id} title={t(win.appId)} icon={apps[win.appId]?.icon} defaultStyle={{ width: 800, height: 600, top: 50, left: 120 }}>
          <PowerPointApp />
        </Window>
      ))}

      {/* Calculator App */}
      {windowInstances.filter(w => w.appId === 'calculator').map(win => (
        <Window key={win.id} id={win.id} title={t('calculator')} icon={apps['calculator']?.icon} defaultStyle={{ width: 250, height: 350, top: 150, left: 300 }}>
          <CalculatorApp />
        </Window>
      ))}

      {/* Calendar App */}
      {windowInstances.filter(w => w.appId === 'calendar').map(win => (
        <Window key={win.id} id={win.id} title={t('calendar')} icon={apps['calendar']?.icon} defaultStyle={{ width: 300, height: 350, top: 100, left: 400 }}>
          <CalendarApp />
        </Window>
      ))}

      {/* Terminal App */}
      {windowInstances.filter(w => w.appId === 'terminal').map(win => (
        <Window key={win.id} id={win.id} title={t('terminal')} icon={apps['terminal']?.icon} defaultStyle={{ width: 600, height: 400, top: 80, left: 120 }}>
          <TerminalApp />
        </Window>
      ))}

      {/* Sticky Notes App */}
      {windowInstances.filter(w => w.appId === 'stickynotes').map(win => (
        <Window key={win.id} id={win.id} title={t('stickynotes')} icon={apps['stickynotes']?.icon} defaultStyle={{ width: 400, height: 400, top: 120, left: 250 }}>
          <StickyNotesApp />
        </Window>
      ))}

      {/* Music Player App */}
      {windowInstances.filter(w => w.appId === 'musicplayer').map(win => (
        <Window key={win.id} id={win.id} title={t('musicplayer')} icon={apps['musicplayer']?.icon} defaultStyle={{ width: 350, height: 450, top: 60, left: 500 }}>
          <MusicPlayerApp />
        </Window>
      ))}

      {/* Cookie Soap App */}
      {windowInstances.filter(w => w.appId === 'cookiesoap').map(win => (
        <Window key={win.id} id={win.id} title={t('cookiesoap')} icon={apps['cookiesoap']?.icon} defaultStyle={{ width: 500, height: 600, top: 50, left: 200 }}>
          <CookieSoapApp />
        </Window>
      ))}

      {/* Roblox App */}
      {windowInstances.filter(w => w.appId === 'roblox').map(win => (
        <Window key={win.id} id={win.id} title={t('roblox')} icon={apps['roblox']?.icon} defaultStyle={{ width: 450, height: 500, top: 100, left: 300 }}>
          <RobloxApp />
        </Window>
      ))}

      {/* Video Player App */}
      {windowInstances.filter(w => w.appId === 'videoplayer').map(win => (
        <Window 
          key={win.id} 
          id={win.id} 
          title={t('videoplayer')} 
          icon={apps['videoplayer']?.icon} 
          defaultStyle={{ width: 640, height: 480, top: 80, left: 120 }}
          onDragOver={(e: any) => e.preventDefault()}
          onDrop={(e: any) => {
            e.preventDefault();
            try {
              const sourcePath = JSON.parse(e.dataTransfer.getData('sourcePath'));
              let item = fileSystem;
              for (let i = 0; i < sourcePath.length; i++) {
                item = i === 0 ? item[sourcePath[i]] : item.contents[sourcePath[i]];
              }
              if (item && item.type === 'file' && item.app === 'videoplayer') {
                setSelectedVideo(item.content);
              }
            } catch (err) {}
          }}
        >
          <VideoPlayerApp selectedVideo={selectedVideo} />
        </Window>
      ))}

      {/* Weather App */}
      {windowInstances.filter(w => w.appId === 'weather').map(win => (
        <Window key={win.id} id={win.id} title={t('weather')} icon={apps['weather']?.icon} defaultStyle={{ width: 300, height: 400, top: 90, left: 450 }}>
          <WeatherApp />
        </Window>
      ))}

      {/* Task Manager App */}
      {windowInstances.filter(w => w.appId === 'taskmanager').map(win => (
        <Window key={win.id} id={win.id} title={t('taskmanager')} icon={apps['taskmanager']?.icon} defaultStyle={{ width: 500, height: 400, top: 110, left: 200 }}>
          <TaskManagerApp windows={windowInstances.map(wi => ({ ...wi, ...apps[wi.appId] }))} />
        </Window>
      ))}

      {/* Recycle Bin App */}
      {windowInstances.filter(w => w.appId === 'recyclebin').map(win => (
        <Window key={win.id} id={win.id} title={t('recyclebin')} icon={apps['recyclebin']?.icon} defaultStyle={{ width: 600, height: 400, top: 70, left: 150 }}>
          <div className="flex flex-col h-full bg-white text-black">
            <div className="p-3 border-b bg-gray-50 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <img src={apps['recyclebin'].icon} alt="" className="w-5 h-5" />
                <span className="text-sm font-black tracking-tighter uppercase italic text-gray-700">Recycle Bin <span className="text-[10px] font-normal not-italic text-gray-400 font-mono ml-2">(C:\Windows 11)</span></span>
              </div>
              <div className="flex gap-2">
                <button 
                  className="text-[10px] font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                  onClick={() => setCurrentPath(['C:', 'Windows 11'])}
                >
                  📂 EXPLORE
                </button>
                <button 
                  className="text-[10px] font-bold bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm active:scale-95"
                  onClick={emptyRecycleBin}
                >
                  🗑️ EMPTY BIN
                </button>
              </div>
            </div>
            <div className="flex-grow p-6 overflow-y-auto grid grid-cols-4 md:grid-cols-5 content-start gap-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed">
              {Object.entries(fileSystem['C:']?.contents?.['Windows 11']?.contents || {}).map(([name, item]: [string, any]) => (
                <div 
                  key={name} 
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setExplorerContextMenu({ x: e.clientX, y: e.clientY, path: ['C:', 'Windows 11', name] });
                  }}
                >
                  <div className="relative">
                    <img src={item.icon || folderIcon} alt="" className="w-12 h-12 drop-shadow-md group-hover:scale-110 transition-transform" />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center border border-white shadow-sm" title="Original Path Available">
                       <span className="text-[8px] font-bold">!</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium truncate w-full px-1 py-0.5 rounded group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">{name}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[8px] bg-green-500 text-white px-1.5 py-0.5 rounded-md hover:bg-green-600 font-bold uppercase" onClick={() => restoreItem(['C:', 'Windows 11', name])}>Restore</button>
                      <button className="text-[8px] bg-gray-400 text-white px-1.5 py-0.5 rounded-md hover:bg-gray-500 font-bold uppercase" onClick={() => deleteItem(['C:', 'Windows 11', name])}>Del</button>
                  </div>
                </div>
              ))}
              {Object.keys(fileSystem['C:']?.contents?.['Windows 11']?.contents || {}).length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center h-48 opacity-20 pointer-events-none grayscale">
                  <img src="https://files.softicons.com/download/system-icons/windows-8-metro-icons-by-dakirby309/png/128x128/Folders%20&%20OS/Recycle%20Bin%20Empty.png" className="w-24 h-24 mb-4" />
                  <p className="font-black italic text-xl uppercase tracking-[0.2em]">The void is empty</p>
                </div>
              )}
            </div>
          </div>
        </Window>
      ))}

      {/* w3SHIT App */}
      {windowInstances.filter(w => w.appId === 'w3shit').map(win => (
        <Window key={win.id} id={win.id} title={t('w3shit')} icon={apps['w3shit']?.icon} defaultStyle={{ width: 800, height: 600, top: 50, left: 100 }}>
          <W3ShitApp onSave={(name, content) => {
            createNewFile(name, 'file', 'html', content);
            showNotification(`Saved ${name}.html to Desktop`);
          }} />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'paint').map(win => (
        <Window key={win.id} id={win.id} title={t('paint')} icon={apps['paint']?.icon} defaultStyle={{ width: 800, height: 600, top: 60, left: 120 }}>
          <PaintApp onSetWallpaper={(url) => setWallpaper(url)} />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'mspomp').map(win => (
        <Window key={win.id} id={win.id} title={t('mspomp')} icon={apps['mspomp']?.icon} defaultStyle={{ width: 350, height: 450, top: 100, left: 400 }}>
          <MsPompApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'aboutme').map(win => (
        <Window key={win.id} id={win.id} title={t('aboutme')} icon={apps['aboutme']?.icon} defaultStyle={{ width: 450, height: 500, top: 36, left: 330 }}>
        <div className="about-me-content">
            <h2 className="flex items-center gap-2 mb-4 text-lg">Hello Darius here! So im building a os! <img src="https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/32x32/emotes/face-grin.png" className="w-6" alt="grin"/></h2>
            <p className="mb-2 text-sm"><strong>birthday:</strong> may 16, 2015</p>
            <p className="mb-2 text-sm"><strong>age:</strong> 10</p>
            <p className="mb-2 text-sm"><strong>pronouns:</strong> he/him</p>
            <p className="mb-2 text-sm">started creating content in 2023</p>
            <p className="mb-2 text-sm"><strong>proof:</strong></p>
            <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/19b9fd84-3658-43bf-be28-d0473eb1bc25/dlsjdpa-2e268584-cf7a-4692-8635-dd312b31af33.png/v1/fill/w_229,h_68,q_80,strp/screenshot_2026_04_04_202303_by_doblebubble_dlsjdpa-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjgiLCJwYXRoIjoiL2YvMTliOWZkODQtMzY1OC00M2JmLWJlMjgtZDA0NzNlYjFiYzI1L2Rsc2pkcGEtMmUyNjg1ODQtY2Y3YS00NjkyLTg2MzUtZGQzMTJiMzFhZjMzLnBuZyIsIndpZHRoIjoiPD0yMjkifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.Um7pSdjscqBS_iqUkrVw__UpAUMvv20aZGZQYsWluIo" className="max-w-full rounded border border-gray-300 mt-1" alt="proof" />
            <p className="mt-4 text-sm">I live in portugl and gemini built a bit ;)</p>
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'about_os').map(win => (
        <Window key={win.id} id={win.id} title={t('about_os')} icon={apps['about_os']?.icon} defaultStyle={{ width: 600, height: 500, top: 120, left: 120 }}>
          <AboutOSApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'mspomp_update').map(win => (
        <Window key={win.id} id={win.id} title="Ms. Pomp Update" icon={apps['mspomp_update']?.icon} defaultStyle={{ width: 450, height: 600, top: 100, left: 200 }}>
          <MsPompUpdate />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'appmaker').map(win => (
        <Window key={win.id} id={win.id} title="App Maker" icon={apps['appmaker']?.icon} defaultStyle={{ width: 650, height: 750, top: 40, left: 300 }} contentStyle={{ padding: 0 }}>
          <AppMakerApp />
        </Window>
      ))}

      {windowInstances.filter(w => apps[w.appId]?.customContent).map(win => (
        <Window key={win.id} id={win.id} title={apps[win.appId].name} icon={apps[win.appId].icon} defaultStyle={{ width: 800, height: 600, top: 100, left: 100 }}>
          <div className="h-full overflow-auto bg-white text-black p-6 font-sans" dangerouslySetInnerHTML={{ __html: apps[win.appId].customContent }}></div>
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'youtube').map(win => (
        <Window key={win.id} id={win.id} title={t('youtube')} icon={apps['youtube']?.icon} defaultStyle={{ width: 550, height: 500, top: 17, left: 271 }} contentStyle={{ background: '#f1f1f1', color: '#333', textAlign: 'center' }}>
        <h2 className="text-red-600 mb-1 text-2xl font-bold">Digital Class!</h2>
        <p className="text-sm text-gray-600 mb-4">Hosted by Misses Pomp</p>
        
        <img src="https://static.wikitide.net/baldisbasicswiki/0/09/NoL_Sheet_0.png" className="w-36 h-auto rounded-lg shadow-md mb-5 mx-auto" alt="Misses Pomp" />
        
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm text-left">
            <p className="font-bold mb-2">Lesson 1: Welcome & Screen Protector</p>
            <iframe className="h-20 w-full border-none" src="https://www.101soundboards.com/embed/50201633" title="Lesson 1"></iframe>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm text-left">
            <p className="font-bold mb-2">Lesson 2: Turn off your iPhone</p>
            <iframe className="h-20 w-full border-none" src="https://www.101soundboards.com/embed/50201718" title="Lesson 2"></iframe>
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'chrome').map(win => (
        <Window key={win.id} id={win.id} title={t('chrome')} icon={apps['chrome']?.icon} defaultStyle={{ width: 600, height: 500, top: 27, left: 517 }} contentStyle={{ padding: 0 }}>
        <div className="h-full overflow-y-auto bg-[var(--win-bg)] text-[var(--win-text)]">
            {/* Hero Section */}
            <div className="w-full h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-8 text-white relative overflow-hidden">
              <div className="z-10">
                <h2 className="text-3xl font-bold mb-2">Discover New Apps</h2>
                <p className="opacity-90 max-w-xs">Enhance your {t('os_name')} experience with the latest tools and games.</p>
              </div>
              <img src="https://web.archive.org/web/20080103033255im_/http://www.microsoft.com/windows/images/products/expando_products_mobile.jpg" alt="Ad" className="absolute right-0 top-0 h-full object-cover opacity-50 mix-blend-luminosity" />
            </div>

            <div className="p-5">
              <h3 className="mb-4 text-xl font-semibold border-b border-[var(--border-color)] pb-2">Top Free & Paid</h3>
              <div>
                  {renderStoreItems()}
              </div>
            </div>
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'pc').map(win => (
        <Window key={win.id} id={win.id} title={t('pc')} icon={apps['pc']?.icon} defaultStyle={{ width: 800, height: 500, top: 40, left: 60 }} contentStyle={{ padding: 0 }}>
        <div className="explorer-container">
            <div className="explorer-sidebar">
                <div className="explorer-sidebar-item" onClick={() => loadDirectory('C:')}>
                    <img src="https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/128x128/devices/hdd_unmount.png" alt="C:" /> Local Disk (C:)
                </div>
                <div className="explorer-sidebar-item" onClick={() => loadDirectory('D:')}>
                    <img src="https://files.softicons.com/download/system-icons/nerve-icons-by-groove69/png/128/Disc_Drive_18.png" alt="D:" /> Disc Drive (D:)
                </div>
                <div className="border-t my-2 border-gray-200"></div>
                <div className="explorer-sidebar-item group" onClick={() => setCurrentPath(['C:', 'Windows 11'])}>
                    <img 
                      src={Object.keys(fileSystem['C:']?.contents?.['Windows 11']?.contents || {}).length > 0
                        ? 'https://files.softicons.com/download/system-icons/windows-8-metro-icons-by-dakirby309/png/128x128/Folders%20&%20OS/Recycle%20Bin%20Full.png'
                        : 'https://files.softicons.com/download/system-icons/windows-8-metro-icons-by-dakirby309/png/128x128/Folders%20&%20OS/Recycle%20Bin%20Empty.png'
                      } 
                      alt="Recycle Bin" 
                      className="group-hover:scale-110 transition-transform"
                    /> 
                    Recycle Bin
                </div>
            </div>
            <div className="explorer-main">
                <div className="explorer-toolbar">
                    <button className="mock-btn m-0 py-1.5 px-3 bg-gray-600" onClick={goUp}>Up</button>
                    <button 
                      className={`mock-btn m-0 py-1.5 px-3 ${fsHistory.length === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} 
                      onClick={undoFileOperation}
                      disabled={fsHistory.length === 0}
                    >
                      Undo
                    </button>
                    <button 
                      className={`mock-btn m-0 py-1.5 px-3 ${fsRedoStack.length === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`} 
                      onClick={redoFileOperation}
                      disabled={fsRedoStack.length === 0}
                    >
                      Redo
                    </button>
                    <input type="text" className="path-input" value={currentPath.join('\\')} readOnly />
                    <input 
                      type="text" 
                      className="path-input ml-2" 
                      placeholder="Search files & contents..." 
                      value={explorerSearchQuery} 
                      onChange={e => setExplorerSearchQuery(e.target.value)} 
                    />
                </div>
                {/* Explorer View Bar */}
                <div className="flex items-center gap-4 px-4 py-1.5 bg-gray-100 border-b border-gray-300 text-[10px] text-gray-500 overflow-x-auto whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold uppercase tracking-tighter">View:</span>
                    <div className="flex gap-1">
                      {['small', 'medium', 'large'].map(size => (
                        <button 
                          key={size}
                          onClick={() => setDesktopViewSize(size as any)}
                          className={`px-2 py-0.5 rounded border border-gray-300 hover:bg-white transition-colors capitalize ${desktopViewSize === size ? 'bg-white shadow-sm ring-1 ring-blue-400 text-blue-600' : 'bg-transparent'}`}
                        >
                          {size === 'medium' ? 'List' : size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold uppercase tracking-tighter">Sort:</span>
                    <div className="flex gap-1">
                      {['name', 'type'].map(sort => (
                        <button 
                          key={sort}
                          onClick={() => setDesktopSortBy(sort as any)}
                          className={`px-2 py-0.5 rounded border border-gray-300 hover:bg-white transition-colors capitalize ${desktopSortBy === sort ? 'bg-white shadow-sm ring-1 ring-blue-400 text-blue-600' : 'bg-transparent'}`}
                        >
                          {sort}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-0.5 hover:bg-gray-200 rounded transition-colors" title="Manage Group">Group</button>
                    <button className="px-2 py-0.5 hover:bg-gray-200 rounded transition-colors" title="Filter results">Filter</button>
                    <button 
                      className="px-2 py-0.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold shadow-sm transition-transform active:scale-95" 
                      onClick={() => createNewFile(currentPath, 'folder')}
                      title="Create directory"
                    >
                      New Folder
                    </button>
                  </div>
                </div>
                <div className="explorer-content-area">
                    {renderExplorerContent()}
                </div>
            </div>
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'stonemeni').map(win => (
        <Window key={win.id} id={win.id} title={t('stonemeni')} icon={apps['stonemeni']?.icon} defaultStyle={{ width: 400, height: 500, top: 90, left: 350 }} contentStyle={{ display: 'flex', flexDirection: 'column', padding: '15px' }}>
        <div className="flex-grow overflow-y-auto flex flex-col gap-2 mb-3 pr-1">
            {stoneMessages.map((msg, idx) => (
                <div key={idx} className={`chat-bubble ${msg.sender === 'bot' ? 'chat-bot' : 'chat-user'}`}>
                    {msg.sender === 'bot' && <img src={apps['stonemeni']?.icon || undefined} alt="bot" />}
                    <div>
                        {msg.sender === 'bot' && <strong>Stonemeni<br/></strong>}
                        {msg.text}
                    </div>
                </div>
            ))}
        </div>
        <div className="flex gap-2">
            <input 
              type="text" 
              className="mock-input mt-0" 
              placeholder="Message Stonemeni..." 
              value={stoneInput}
              onChange={e => setStoneInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendStoneMsg()}
            />
            <button className="mock-btn mt-0" onClick={sendStoneMsg}>Send</button>
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'claude').map(win => (
        <Window key={win.id} id={win.id} title={t('claude')} icon={apps['claude']?.icon} defaultStyle={{ width: 400, height: 500, top: 120, left: 400 }} contentStyle={{ display: 'flex', flexDirection: 'column', padding: '15px', background: '#f5f4f0' }}>
        <div className="flex-grow overflow-y-auto flex flex-col gap-2 mb-3 pr-1">
            <div className="chat-bubble chat-bot" style={{ background: '#e0dcd0', color: '#333' }}>
                <img src={apps['claude']?.icon || undefined} alt="bot" />
                <div>
                    <strong>Claude:</strong><br/>
                    I cannot fulfill this request. I am unable to assist with anything that might be considered even slightly unsafe, controversial, or fun.
                </div>
            </div>
        </div>
        <div className="flex gap-2">
            <input 
                type="text" 
                className="mock-input mt-0" 
                placeholder="Message Claude..." 
                disabled
            />
            <button className="mock-btn mt-0 opacity-50 cursor-not-allowed" disabled>Send</button>
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'settings').map(win => (
        <Window key={win.id} id={win.id} title={t('settings')} icon={apps['settings']?.icon} defaultStyle={{ width: 500, height: 600, top: 100, left: 200 }} contentStyle={{ padding: '20px' }}>
        <h2 className="text-2xl font-bold mb-4">System Settings</h2>
        <SettingsApp />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'theme_store').map(win => (
        <Window key={win.id} id={win.id} title="Theme Store" icon={apps['theme_store']?.icon} defaultStyle={{ width: 600, height: 500, top: 80, left: 180 }} contentStyle={{ padding: 0 }}>
          <ThemeStoreApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'textdocs').map(win => (
        <Window key={win.id} id={win.id} title={t('textdocs')} icon={apps['textdocs']?.icon} defaultStyle={{ width: 500, height: 400, top: 110, left: 150 }} contentStyle={{ padding: 0 }}>
        <TextDocsApp />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'flashplayer').map(win => (
        <Window key={win.id} id={win.id} title={t('flashplayer')} icon={apps['flashplayer']?.icon} defaultStyle={{ width: 800, height: 600, top: 50, left: 100 }} contentStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#111' }}>
        <div className="flex bg-gray-800 p-2 gap-2 overflow-x-auto border-b border-gray-700 shrink-0">
           <button onClick={() => setSelectedFlashGame('tawog-water-sons')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Water Sons</button>
           <button onClick={() => setSelectedFlashGame('gumball-donkey-dash_202409')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Donkey Dash</button>
           <button onClick={() => setSelectedFlashGame('blind-fooled_202408')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Blind Fooled</button>
           <button onClick={() => setSelectedFlashGame('cannon-bird-3')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Cannon Bird 3</button>
           <button onClick={() => setSelectedFlashGame('rifleman-mario')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Rifleman Mario</button>
           <button onClick={() => setSelectedFlashGame('super-mario-63')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Super Mario 63</button>
           <button onClick={() => setSelectedFlashGame('fancy-pants-adventure-world-1')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Fancy Pants</button>
           <button onClick={() => setSelectedFlashGame('bloons-tower-defense-4')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Bloons TDR 4</button>
           <button onClick={() => setSelectedFlashGame('age-of-war')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Age of War</button>
           <button onClick={() => setSelectedFlashGame('the-impossible-quiz')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Impossible Quiz</button>
           <button onClick={() => setSelectedFlashGame('run-3')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Run 3</button>
           <button onClick={() => setSelectedFlashGame('duck-life-4')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Duck Life 4</button>
           <button onClick={() => setSelectedFlashGame('super-mario-flash')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Super Mario Flash</button>
           <button onClick={() => setSelectedFlashGame('sonic-flash')} className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 whitespace-nowrap">Sonic Flash</button>
        </div>
        <div className="flex-grow relative bg-black">
           {selectedFlashGame ? (
              <iframe src={`https://archive.org/embed/${selectedFlashGame}`} className="w-full h-full border-none" allowFullScreen></iframe>
           ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">Select a game from the menu to start playing.</div>
           )}
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'nesplayer').map(win => (
        <Window key={win.id} id={win.id} title={t('nesplayer')} icon={apps['nesplayer']?.icon} defaultStyle={{ width: 800, height: 600, top: 70, left: 120 }} contentStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: '#000' }}>
        <div className="flex bg-red-900 p-2 gap-2 overflow-x-auto border-b border-red-800 shrink-0">
           <button onClick={() => setSelectedNesGame('donkey-kong-classics_202502')} className="px-3 py-1 bg-red-800 text-white rounded hover:bg-red-700 whitespace-nowrap">Donkey Kong Classics</button>
           <button onClick={() => setSelectedNesGame('my-nes-collection_202408')} className="px-3 py-1 bg-red-800 text-white rounded hover:bg-red-700 whitespace-nowrap">My NES Collection</button>
        </div>
        <div className="flex-grow relative bg-black">
           {selectedNesGame ? (
              <iframe src={`https://archive.org/embed/${selectedNesGame}`} className="w-full h-full border-none" allowFullScreen></iframe>
           ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">Select a classic NES game to start playing.</div>
           )}
        </div>
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'sysmon').map(win => (
        <Window key={win.id} id={win.id} title={t('sysmon')} icon={apps['sysmon']?.icon} defaultStyle={{ width: 400, height: 300, top: 100, left: 100 }} contentStyle={{ padding: 0 }}>
        <SystemMonitorApp />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'gchat').map(win => (
        <Window key={win.id} id={win.id} title={t('gchat')} icon={apps['gchat']?.icon} defaultStyle={{ width: 350, height: 500, top: 150, left: 200 }} contentStyle={{ padding: 0 }}>
        <GoogleChatApp />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'browser').map(win => (
        <Window key={win.id} id={win.id} title={t('browser')} icon={apps['browser']?.icon} defaultStyle={{ width: 800, height: 600, top: 50, left: 150 }} contentStyle={{ padding: 0 }}>
        <BrowserApp />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'bowser').map(win => (
        <Window key={win.id} id={win.id} title={t('bowser')} icon={apps['bowser']?.icon} defaultStyle={{ width: 800, height: 600, top: 60, left: 160 }} contentStyle={{ padding: 0 }}>
        <BowserApp />
      </Window>
      ))}

      /* {windowInstances.filter(w => w.appId === 'videoeditor').map(win => (
        <Window 
          key={win.id} 
          id={win.id} 
          title={t('videoeditor') || 'Video Editor'} 
          icon={apps['videoeditor']?.icon} 
          defaultStyle={{ width: 700, height: 500, top: 80, left: 200 }} 
          contentStyle={{ padding: 0 }}
        >
        <VideoEditorApp />
      </Window>
      ))} */

      {windowInstances.filter(w => w.appId === 'imageviewer').map(win => (
        <Window 
          key={win.id} 
          id={win.id} 
          title={t('imageviewer')} 
          icon={apps['imageviewer']?.icon} 
          defaultStyle={{ width: 500, height: 500, top: 100, left: 250 }} 
          contentStyle={{ padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}
          onDragOver={(e: any) => e.preventDefault()}
          onDrop={(e: any) => {
            e.preventDefault();
            try {
              const sourcePath = JSON.parse(e.dataTransfer.getData('sourcePath'));
              let item = fileSystem;
              for (let i = 0; i < sourcePath.length; i++) {
                item = i === 0 ? item[sourcePath[i]] : item.contents[sourcePath[i]];
              }
              if (item && item.type === 'file' && item.app === 'imageviewer') {
                setSelectedImage(item.content);
              }
            } catch (err) {}
          }}
        >
        <ImageViewerApp />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'angrybirds').map(win => (
        <Window key={win.id} id={win.id} title={t('angrybirds')} icon={apps['angrybirds']?.icon} defaultStyle={{ width: 300, height: 420, top: 50, left: 300 }} contentStyle={{ padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AngryBirdsGame isActive={activeWindows[win.id]} />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'win9').map(win => (
        <Window key={win.id} id={win.id} title={t('win9')} icon={apps['win9']?.icon} defaultStyle={{ width: 1000, height: 750, top: 20, left: 20 }}>
          <Win9App />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'macstars').map(win => (
        <Window key={win.id} id={win.id} title={t('macstars') || 'Mac Stars'} icon={apps['macstars']?.icon} defaultStyle={{ width: 550, height: 420, top: 100, left: 100 }} contentStyle={{ padding: 0 }}>
          <MacStarsApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'vmware').map(win => (
        <Window key={win.id} id={win.id} title={t('vmware')} icon={apps['vmware']?.icon} defaultStyle={{ width: 900, height: 600, top: 40, left: 40 }} contentStyle={{ padding: 0 }}>
          <VMwareApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'steam').map(win => (
        <Window key={win.id} id={win.id} title={t('steam')} icon={apps['steam']?.icon} defaultStyle={{ width: 700, height: 500, top: 40, left: 80 }} contentStyle={{ padding: 0 }}>
          <SteamApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'photoshop').map(win => (
        <Window key={win.id} id={win.id} title={t('photoshop')} icon={apps['photoshop']?.icon} defaultStyle={{ width: 800, height: 600, top: 20, left: 40 }} contentStyle={{ padding: 0 }}>
          <PhotoshopApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'outlook').map(win => (
        <Window key={win.id} id={win.id} title={t('outlook')} icon={apps['outlook']?.icon} defaultStyle={{ width: 750, height: 550, top: 60, left: 100 }} contentStyle={{ padding: 0 }}>
          <OutlookApp />
        </Window>
      ))}

      {windowInstances.filter(w => ['eve', 'fallout', 'reason', 'skyrim', 'gog', 'wizard101', 'matlab', 'sims3', 'metatrader'].includes(w.appId)).map(win => (
        <Window key={win.id} id={win.id} title={t(win.appId)} icon={apps[win.appId]?.icon} defaultStyle={{ width: 600, height: 450, top: 80, left: 120 }} contentStyle={{ padding: 0 }}>
          <GenericWindowsApp name={apps[win.appId]?.name} icon={apps[win.appId]?.icon} />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === '000').map(win => (
        <Window key={win.id} id={win.id} title={t('000')} icon={apps['000']?.icon} defaultStyle={{ width: 400, height: 300, top: 150, left: 200 }} contentStyle={{ padding: 0 }}>
          <ZeroZeroZeroApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'winxphorror').map(win => (
        <Window key={win.id} id={win.id} title={t('winxphorror')} icon={apps['winxphorror']?.icon} defaultStyle={{ width: 600, height: 500, top: 50, left: 100 }} contentStyle={{ padding: 0 }}>
          <WinXPHorrorApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'wine').map(win => (
        <Window key={win.id} id={win.id} title={t('wine')} icon={apps['wine']?.icon} defaultStyle={{ width: 400, height: 500, top: 100, left: 150 }} contentStyle={{ padding: 0 }}>
          <WineApp />
        </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'cryforme').map(win => (
        <Window key={win.id} id={win.id} title={t('cryforme') || 'Cry For Me'} icon={apps['cryforme']?.icon} defaultStyle={{ width: 500, height: 750, top: 50, left: 150 }} contentStyle={{ padding: 0 }}>
          <CryForMeApp />
        </Window>
      ))}

      {windowInstances.filter(w => apps[w.appId]?.iframeUrl || apps[w.appId]?.isSimulated).map(win => (
        <Window key={win.id} id={win.id} title={t(win.appId) || apps[win.appId].name} icon={apps[win.appId]?.icon} defaultStyle={{ width: 800, height: 600, top: 50, left: 50 }} contentStyle={{ padding: 0 }}>
          {apps[win.appId].isSimulated ? (
            <SimulatedAppContent app={apps[win.appId]} />
          ) : (
            <iframe src={apps[win.appId].iframeUrl} className="w-full h-full border-none" allowFullScreen></iframe>
          )}
        </Window>
      ))}

      {/* Games */}
      {windowInstances.filter(w => w.appId === 'bouncyball').map(win => (
        <Window key={win.id} id={win.id} title="Bouncy Ball" icon={apps['bouncyball']?.icon} defaultStyle={{ width: 350, height: 480, top: 0, left: 236 }} contentStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="mb-2 text-xs">Click canvas to apply force!</p>
        <BouncyBallGame isActive={activeWindows[win.id]} />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'balloon').map(win => (
        <Window key={win.id} id={win.id} title="Protect Balloon" icon={apps['balloon']?.icon} defaultStyle={{ width: 350, height: 480, top: 78, left: 270 }} contentStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="mb-2 text-xs">Move mouse left/right to dodge spikes!</p>
        <ProtectBalloonGame isActive={activeWindows[win.id]} />
      </Window>
      ))}

      {windowInstances.filter(w => w.appId === 'flappy').map(win => (
        <Window key={win.id} id={win.id} title="Flappy Bird" icon={apps['flappy']?.icon} defaultStyle={{ width: 350, height: 480, top: 17, left: 237 }} contentStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p className="mb-2 text-xs">Click canvas or press Space to flap!</p>
        <FlappyBirdGame isActive={activeWindows[win.id]} />
      </Window>
      ))}

      {/* Custom Apps */}
      {windowInstances.filter(w => w.appId.startsWith('published_app_')).map(win => {
        const app = apps[win.appId];
        if (!app) return null;
        return (
          <Window key={win.id} id={win.id} title={app.name} icon={app.icon} defaultStyle={{ width: 450, height: 400, top: 150, left: 200 }} contentStyle={{ background: app.customBg, color: app.customColor, fontFamily: app.customFont }}>
              <div dangerouslySetInnerHTML={{ __html: app.customHtml }} />
          </Window>
        );
      })}

      {/* Cydia (Real) */}
      {windowInstances.filter(w => w.appId === 'cydia').map(win => (
        <Window key={win.id} id={win.id} title={t('cydia')} icon={apps['cydia']?.icon} defaultStyle={{ width: 600, height: 500, top: 50, left: 100 }} contentStyle={{ background: '#111', color: '#0f0', fontFamily: 'monospace' }}>
         <div className="p-4 h-full overflow-y-auto">
           <h1 className="text-3xl font-bold mb-4 border-b border-green-800 pb-2">Cydia (Rooted)</h1>
           
           <div className="mb-6">
             <h2 className="text-xl font-bold mb-2 text-white">1. AppStore Hacks</h2>
             <div className="flex gap-2">
               <button className="bg-green-900 hover:bg-green-700 text-white px-4 py-2 rounded" onClick={() => {
                 setApps(prev => {
                   const next = {...prev};
                   Object.keys(next).forEach(k => next[k].isDownloaded = true);
                   return next;
                 });
                 showNotification("All paid apps unlocked!");
               }}>Unlock All Paid Apps</button>
               <button className="bg-red-900 hover:bg-red-700 text-white px-4 py-2 rounded" onClick={() => {
                 setApps(prev => {
                   const next = {...prev};
                   const essentials = ['aboutme', 'appmaker', 'youtube', 'chrome', 'settings', 'cydia', 'pc', 'sysmon', 'browser', 'imageviewer', 'calculator', 'calendar', 'terminal', 'stickynotes', 'musicplayer', 'weather', 'recyclebin', 'taskmanager'];
                   Object.keys(next).forEach(k => {
                     if (!essentials.includes(k)) next[k].isDownloaded = false;
                   });
                   return next;
                 });
                 showNotification("All non-essential apps deleted!");
               }}>Delete All Apps</button>
             </div>
           </div>

           <div className="mb-6">
             <h2 className="text-xl font-bold mb-2 text-white">2. The Gooey Piraty Dark Web</h2>
             <div className="flex flex-col gap-2">
               {['hydra', 'cydia_fake', 'doge_unlocked', 'talking_horror'].map(appId => (
                 <div key={appId} className="flex justify-between items-center bg-black p-2 border border-green-900">
                   <div className="flex items-center gap-2">
                     <img src={apps[appId]?.icon} className="w-8 h-8" />
                     <span>{apps[appId]?.name}</span>
                   </div>
                   <button className="bg-green-900 hover:bg-green-700 px-3 py-1 rounded" onClick={() => {
                     setApps(prev => ({...prev, [appId]: {...prev[appId], isDownloaded: true}}));
                     showNotification(`${apps[appId]?.name} installed!`);
                   }}>Install</button>
                 </div>
               ))}
             </div>
           </div>

           <div className="mb-6">
             <h2 className="text-xl font-bold mb-2 text-white">3. Identity Spoofing</h2>
             <div className="flex flex-col gap-2">
               <input type="text" value={userName} onChange={e => setUserName(e.target.value)} className="bg-black border border-green-900 p-1 text-green-500" placeholder="Change Name" />
               <input type="text" value={userPfp} onChange={e => setUserPfp(e.target.value)} className="bg-black border border-green-900 p-1 text-green-500" placeholder="Change PFP URL" />
             </div>
           </div>

           <div className="mb-6">
             <h2 className="text-xl font-bold mb-2 text-white">4. Sketchy Sites (Yuck)</h2>
             <div className="flex flex-col gap-1 text-blue-400 underline cursor-pointer">
               <a onClick={() => showNotification("VIRUS BLOCKED: You don't want to go there.")}>http://freerobux.ru/totally-legit</a>
               <a onClick={() => showNotification("ERROR 404: Site seized by FBI.")}>http://darkweb-market.onion/buy-plutonium</a>
               <a onClick={() => showNotification("Ew, gross. Blocked by SafeSearch.")}>http://yuckkkkkkk.com/gross-stuff</a>
             </div>
           </div>
         </div>
      </Window>
      ))}

      {/* Fake Cydia */}
      {windowInstances.filter(w => w.appId === 'cydia_fake').map(win => (
        <Window key={win.id} id={win.id} title={t('cydia_fake')} icon={apps['cydia_fake']?.icon} defaultStyle={{ width: 400, height: 600, top: 100, left: 150 }} contentStyle={{ padding: 0 }}>
        <iframe src="https://apphacks.co/lb/Cydia/svc" className="w-full h-full border-0" title="Fake Cydia" />
      </Window>
      ))}

      {/* Doge Unlocked */}
      {windowInstances.filter(w => w.appId === 'doge_unlocked').map(win => (
        <Window key={win.id} id={win.id} title={t('doge_unlocked')} icon={apps['doge_unlocked']?.icon} defaultStyle={{ width: 500, height: 400, top: 200, left: 300 }} contentStyle={{ background: 'red', color: 'yellow', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 className="text-5xl font-bold animate-bounce">VIRUS DETECTED</h1>
        <img src={apps['doge_unlocked']?.icon} className="w-32 h-32 animate-ping mt-4" alt="doge" />
        <p className="mt-4 text-2xl font-mono">MUCH HACK. VERY VIRUS. WOW.</p>
      </Window>
      ))}

      {/* Talking Horror */}
      {windowInstances.filter(w => w.appId === 'talking_horror').map(win => (
        <Window key={win.id} id={win.id} title={t('talking_horror')} icon={apps['talking_horror']?.icon} defaultStyle={{ width: 350, height: 500, top: 100, left: 400 }} contentStyle={{ background: '#000', color: '#f00', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
        <img src={apps['talking_horror']?.icon} className="w-48 h-48 mb-6 filter grayscale contrast-200" alt="horror" />
        <h2 className="text-2xl font-serif text-center">I see you, {userName}...</h2>
        <p className="mt-4 text-center opacity-50">Why did you install me?</p>
      </Window>
      ))}

      {/* Hydra Apps */}
      {windowInstances.filter(w => w.appId.startsWith('hydra')).map(win => {
        const app = apps[win.appId] || apps['hydra'];
        return (
          <Window key={win.id} id={win.id} title={t('hydra')} icon={app?.icon} defaultStyle={{ width: 300, height: 200, top: 150, left: 200 }} contentStyle={{ background: 'black', color: 'lime', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <img src={app?.icon} className="w-16 h-16 mb-4 animate-pulse" alt="bug" />
            <h2 className="text-xl font-bold">HAIL HYDRA</h2>
            <p className="text-xs mt-2">Cut one head off...</p>
          </Window>
        );
      })}

      {/* Doge App */}
      {windowInstances.filter(w => w.appId === 'doge').map(win => (
        <Window key={win.id} id={win.id} title={t('doge')} icon={apps['doge']?.icon} defaultStyle={{ width: 500, height: 500, top: 50, left: 300 }} contentStyle={{ background: 'hotpink', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        <h1 className="text-cyan-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] font-['Comic_Sans_MS'] absolute top-5 left-5 -rotate-12 text-4xl">Wow</h1>
        <h1 className="text-green-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] font-['Comic_Sans_MS'] absolute bottom-10 right-8 rotate-12 text-4xl">Such Konami</h1>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv-lY5cLcjqii8NSgwQe5cgDx5JANXYbFUnA&s" style={{ width: '200px', animation: 'spinDvd 4s linear infinite alternate' }} alt="doge" />
        <h1 className="text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] font-['Comic_Sans_MS'] absolute top-16 right-12 rotate-[20deg] text-4xl">Much Code</h1>
      </Window>
      ))}


      {/* Explorer Context Menu */}
      {explorerContextMenu.path && (
        <div 
          className="fixed bg-white border border-gray-300 shadow-xl rounded-md py-1 z-[10000] min-w-[150px] text-sm text-black"
          style={{ top: explorerContextMenu.y, left: explorerContextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-1.5 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center gap-2" onClick={() => {
            const path = explorerContextMenu.path!;
            const folder = getFolderFromPath(path.slice(0, -1));
            const item = folder?.contents[path[path.length - 1]];
            if (item) openItem(path[path.length - 1], item);
            setExplorerContextMenu({ x: 0, y: 0, path: null });
          }}>
             Open
          </div>
          <div className="px-4 py-1.5 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center gap-2" onClick={() => {
            setRenamingPath(explorerContextMenu.path);
            setRenameValue(explorerContextMenu.path![explorerContextMenu.path!.length - 1]);
            setExplorerContextMenu({ x: 0, y: 0, path: null });
          }}>
            Rename
          </div>
          {explorerContextMenu.path[1] === 'Windows 11' && (
            <div className="px-4 py-1.5 hover:bg-green-600 hover:text-white cursor-pointer flex items-center gap-2" onClick={() => {
              restoreItem(explorerContextMenu.path!);
              setExplorerContextMenu({ x: 0, y: 0, path: null });
            }}>
              <img src="https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/arrow-repeat.png" alt="restore" className="w-4 h-4" />
              Restore
            </div>
          )}
          <div className="border-t my-1"></div>
          <div className="px-4 py-1.5 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center gap-2" onClick={() => {
            if (explorerContextMenu.path) deleteItem(explorerContextMenu.path);
            setExplorerContextMenu({ x: 0, y: 0, path: null });
          }}>
            <img src="https://files.softicons.com/download/toolbar-icons/fugue-16px-icons-by-yusuke-kamiyamane/png/16x16/cross-script.png" alt="delete" className="w-4 h-4" />
            {explorerContextMenu.path[1] === 'Windows 11' ? 'Delete Permanently' : 'Delete'}
          </div>
          {explorerContextMenu.path[1] === 'Windows 11' && (
             <div className="px-4 py-1.5 hover:bg-red-700 hover:text-white cursor-pointer flex items-center gap-2" onClick={() => {
               emptyRecycleBin();
               setExplorerContextMenu({ x: 0, y: 0, path: null });
             }}>
               Empty Recycle Bin
             </div>
          )}
          <div className="border-t my-1"></div>
          <div className="px-4 py-1.5 hover:bg-blue-500 hover:text-white cursor-pointer flex items-center gap-2" onClick={() => setExplorerContextMenu({ x: 0, y: 0, path: null })}>
            Cancel
          </div>
        </div>
      )}

      {/* Taskbar Context Menu */}
      {taskbarContextMenu && (
        <>
          <div className="fixed inset-0 z-[9999]" onClick={() => setTaskbarContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setTaskbarContextMenu(null); }}></div>
          <div 
            className="absolute bg-white/95 border border-gray-300 shadow-2xl rounded-lg p-2 z-[10000] flex flex-col gap-1 min-w-[180px] text-left"
            style={{ left: Math.min(taskbarContextMenu.x, window.innerWidth - 180), bottom: 55 }}
          >
            {taskbarContextMenu.id && (() => {
              const winInst = windowInstances.find(w => w.id === taskbarContextMenu.id);
              const app = winInst ? apps[winInst.appId] : null;
              if (!app) return null;
              return (
              <>
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors font-semibold"
                  onClick={() => { closeWindow(taskbarContextMenu.id!); setTaskbarContextMenu(null); }}
                >
                  <img src={app.icon} className="w-5 h-5" alt="" />
                  Close {app.name}
                </div>
                <div className="border-b border-gray-200 my-1"></div>
              </>
              );
            })()}
            
            <div className="text-xs text-gray-500 font-bold px-2 py-1 uppercase tracking-wider">Launchpad</div>
            <div className="max-h-[300px] overflow-y-auto flex flex-col gap-1">
              {Object.entries(apps as Record<string, any>).filter(([id, app]) => app.isDownloaded).map(([id, app]) => (
                <div 
                  key={id} 
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-500 hover:text-white rounded cursor-pointer text-sm text-gray-800 transition-colors"
                  onClick={() => { openWindow(id); setTaskbarContextMenu(null); }}
                >
                  <img src={app.icon} alt={app.name} className="w-5 h-5" />
                  {app.name}
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-1 pt-1">
              {isKidsMode && (
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-red-100 rounded cursor-pointer text-sm text-red-600 transition-colors font-bold"
                  onClick={() => { startBaldiChallenge(); setTaskbarContextMenu(null); }}
                >
                  <span className="w-5 text-center">🔐</span>
                  Exit Kids Mode
                </div>
              )}
              <div 
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded cursor-pointer text-sm text-gray-800 transition-colors"
                onClick={() => { setIsTaskbarClosed(true); setTaskbarContextMenu(null); showNotification("Taskbar hidden. Re-enable in Devices/Settings."); }}
              >
                <span className="w-5 text-center">⬇️</span>
                Switch to Charms Bar
              </div>
              <div 
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-200 rounded cursor-pointer text-sm text-gray-800 transition-colors"
                onClick={() => { logOff(); setTaskbarContextMenu(null); }}
              >
                <img src="https://files.softicons.com/download/web-icons/themex.net-icons-by-jordanfc/png/32x32/log%20off.png" alt="Log Off" className="w-5 h-5" />
                Log Off
              </div>
            </div>
          </div>
        </>
      )}

      <Clippy windowInstances={windowInstances} />

      {/* Taskbar */}
      {!isTaskbarClosed ? (
      <div id="taskbar" style={{ background: isRedMode ? 'rgba(150, 0, 0, 0.95)' : undefined }} onContextMenu={(e) => {
        if (e.target === e.currentTarget) {
          e.preventDefault();
          setTaskbarContextMenu({ x: e.clientX, y: e.clientY });
        }
      }}>
        <div 
          className={`start-btn ${launchpadActive ? 'active' : ''} ${isRedMode ? 'bg-red-600' : ''} flex items-center gap-1`} 
          onClick={() => {
            setLaunchpadActive(!launchpadActive);
            const newCount = startClickCount + 1;
            setStartClickCount(newCount);
            if (newCount >= 3) {
              setBiosScreenVisible(true);
              setStartClickCount(0);
            }
            // Reset count after 2 seconds of inactivity
            setTimeout(() => setStartClickCount(0), 2000);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            setTaskbarContextMenu({ x: e.clientX, y: e.clientY });
          }}
        >
          <img src="https://files.softicons.com/download/application-icons/fluid-icons-by-arrioch/png/128/rocket.png" alt="Launchpad" /> {t('launchpad')}
        </div>

        <div 
          className="start-btn flex items-center gap-1 group relative overflow-hidden bg-yellow-400/10 border-yellow-400/30 hover:bg-yellow-400 hover:text-black transition-all" 
          onClick={() => setIsJohnnysStoreVisible(!isJohnnysStoreVisible)}
          title="Johnny's Store"
        >
          <img src="https://static.wikia.nocookie.net/baldis-basics-in-education-and-learning/images/d/da/Johnny.png/revision/latest/thumbnail/width/360/height/360?cb=20200913100623&path-prefix=ru" alt="store" className="scale-125" />
          <span className="text-[10px] font-black italic">SHOP</span>
        </div>

        {/* Search Bar */}
        <div className="relative ml-2 flex items-center">
          <input 
            type="text" 
            placeholder={t('search')} 
            className="bg-white/10 border border-white/20 rounded-md px-3 py-1 text-sm text-white focus:outline-none focus:bg-white/20 w-48 transition-all placeholder:text-white/50"
            value={searchQuery}
            onChange={(e) => {
              if (e.target.value.toLowerCase() === 'blackberry') {
                setIsBlackberryMode(prev => !prev);
                setSearchQuery('');
                setIsSearchActive(false);
              } else {
                setSearchQuery(e.target.value);
              }
            }}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => setTimeout(() => setIsSearchActive(false), 200)}
          />
          {isSearchActive && searchQuery && (
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-white/95 border border-gray-300 shadow-2xl rounded-lg p-2 z-[10000] flex flex-col gap-1 max-h-[400px] overflow-y-auto text-left">
              {renderSearchResults()}
            </div>
          )}
        </div>

        <div className="taskbar-apps">
          {renderTaskbarApps()}
        </div>
        <div className="flex items-center gap-2 pr-2">
          <img 
            src="https://files.softicons.com/download/system-icons/crystal-project-icons-by-everaldo-coelho/png/32x32/apps/kdf.png" 
            alt="Widgets" 
            className={`w-5 h-5 cursor-pointer hover:scale-110 transition-transform ${showWidgets ? 'drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'opacity-70'} `}
            onClick={() => setShowWidgets(!showWidgets)}
            title="Desktop Widgets"
          />
          <img 
            src={apps['stonemeni']?.icon} 
            alt="Stonemeni" 
            className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => openWindow('stonemeni')}
            title={t('stonemeni')}
          />
          <img 
            src={apps['settings']?.icon} 
            alt="Settings" 
            className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => openWindow('settings')}
            title={t('settings')}
          />
          <div className="flex items-center gap-1 group relative cursor-pointer" title={wifiConnected ? "WiFi Connected" : "No Internet Connection"}>
            <svg className={`w-4 h-4 ${wifiConnected ? 'text-white' : 'text-red-500'}`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {wifiConnected ? (
                <path d="M12 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-4.6-4.6c2.5-2.5 6.6-2.5 9.2 0l1.4-1.4c-3.3-3.3-8.7-3.3-12 0l1.4 1.4zm-4.2-4.2c4.8-4.8 12.7-4.8 17.5 0l1.4-1.4c-5.6-5.6-14.7-5.6-20.3 0l1.4 1.4zm-4.2-4.2c7.2-7.2 18.8-7.2 26 0l1.4-1.4c-8-8-20.9-8-28.8 0l1.4 1.4z" />
              ) : (
                <path d="M22.8 10.6l-1.4-1.4c-2.3-2.3-5.3-3.4-8.4-3.4-1.3 0-2.6.2-3.8.6l1.6 1.6c.7-.1 1.4-.2 2.2-.2 2.6 0 5.1.9 7 2.8l1.4-1.4zM12 21c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8.8-8.8l1.4 1.4c1 1 2.2 1.6 3.5 1.9l1.5-1.5c-1-.3-1.9-.8-2.6-1.5l-1.4 1.4zm-2.6-2.6l1.4 1.4c2.2 2.2 5.1 3.2 8.1 3.2l1.6-1.6c-2.6 0-5.1-.9-7-2.8l-1.4-1.4zm18.8 11.8l-18-18-1.4 1.4 18 18 1.4-1.4z" />
              )}
            </svg>
          </div>
          <div className="flex items-center gap-1 group relative">
            <img 
              src="https://files.softicons.com/download/toolbar-icons/fatcow-hosting-icons-by-fatcow/png/16/sound.png" 
              alt="Volume" 
              className="w-4 h-4 opacity-70"
            />
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border shadow-xl p-2 rounded hidden group-hover:block w-8 h-32">
              <input type="range" className="h-full w-full appearance-none bg-gray-200 rounded-lg cursor-pointer accent-blue-500" style={{ writingMode: 'vertical-lr', direction: 'rtl' }} />
            </div>
          </div>
          <div id="clock" onClick={clickClock} className="text-[11px] font-medium opacity-80 hover:opacity-100 transition-opacity cursor-pointer whitespace-nowrap">{currentTime}</div>
        </div>
      </div>
      ) : (
        <div 
          className="fixed right-0 top-0 h-full w-[85px] bg-[#111] border-l border-white/5 z-[200000] flex flex-col items-center justify-center gap-6 text-white shadow-[-10px_0_30px_rgba(0,0,0,0.8)]"
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setContextMenu({ visible: true, x: e.clientX, y: e.clientY, targetName: '__charms_bar__' });
          }}
        >
           <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-400 group" onClick={() => setIsSearchActive(!isSearchActive)}>
              <svg className="w-8 h-8 group-hover:scale-110 transition-all opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <span className="text-[11px] font-medium opacity-80 group-hover:opacity-100">Search</span>
           </div>
           <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-green-400 group" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: t('os_name'),
                  text: 'Check out my awesome virtual OS!',
                  url: window.location.href,
                }).catch((error) => console.log('Error sharing', error));
              } else {
                showNotification("Share copied to clipboard!");
                navigator.clipboard.writeText(window.location.href);
              }
           }}>
              <svg className="w-8 h-8 group-hover:scale-110 transition-all opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              <span className="text-[11px] font-medium opacity-80 group-hover:opacity-100">Share</span>
           </div>
           <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-purple-400 group" onClick={() => { setLaunchpadActive(true); }}>
              <svg className="w-8 h-8 group-hover:scale-110 transition-all opacity-80 group-hover:opacity-100" viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h11v11H0zM13 0h11v11H13zM0 13h11v11H0zM13 13h11v11H13z"/></svg>
              <span className="text-[11px] font-medium opacity-80 group-hover:opacity-100">Start</span>
           </div>
           <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-yellow-400 group" onClick={() => { openWindow('settings'); }}>
              <svg className="w-8 h-8 group-hover:scale-110 transition-all opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <span className="text-[11px] font-medium opacity-80 group-hover:opacity-100">Devices</span>
           </div>
           <div className="flex flex-col items-center gap-2 cursor-pointer hover:text-red-400 group" onClick={() => { openWindow('settings'); }}>
              <svg className="w-8 h-8 group-hover:scale-110 transition-all opacity-80 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-[11px] font-medium opacity-80 group-hover:opacity-100">Settings</span>
           </div>
        </div>
      )}

      {/* Download Confirmation Modal */}
      {pendingDownload && (
        <div className="absolute inset-0 bg-black/50 z-[200000] flex items-center justify-center">
          <div className="bg-white text-black p-6 rounded-lg shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Confirm Download</h3>
            <p className="mb-6">Are you sure you want to download <strong>{t(pendingDownload)}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                onClick={() => { playSound('click'); setPendingDownload(null); }}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white"
                onClick={() => { playSound('click'); confirmDownloadApp(pendingDownload); }}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Remix Popups */}
      {errorRemixPopups.map(popup => (
        <div 
          key={popup.id} 
          className="absolute bg-white border-2 border-red-500 shadow-2xl p-4 rounded z-[250000] max-w-[300px]"
          style={{ left: popup.x, top: popup.y }}
        >
          <div className="flex items-center gap-3 mb-2">
            <img src="https://www.mindvideo.ai/_next/image/?url=%2Fimages%2Fgenerate-video%2Fvideo_failure.webp&w=256&q=75" className="w-8 h-8" />
            <span className="font-bold text-red-600">SYSTEM ERROR</span>
          </div>
          <p className="text-sm text-gray-800">{popup.text}</p>
        </div>
      ))}

      {/* Error Remix Fullscreen Video */}
      {errorRemixVideoVisible && (
        <div className="absolute inset-0 z-[260000] bg-black">
          <video 
            src="https://cdn.pixabay.com/video/2022/07/05/123217-727221498_tiny.mp4" 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* PC Removal GIF */}
      {pcRemovalGifVisible && (
        <div className="fixed inset-0 z-[300000] bg-black flex items-center justify-center">
          <img src="https://i.imgur.com/6wj9ZeR.gif" className="max-w-full max-h-full" alt="PC Removal" referrerPolicy="no-referrer" />
        </div>
      )}

      {/* Error Remix BSOD */}
      {errorRemixBSODVisible && (
        <div className={`absolute inset-0 z-[270000] flex flex-col justify-center items-center text-white p-20 font-mono ${errorRemixColorful ? '' : 'bg-blue-700'}`} style={{ background: errorRemixColorful ? `linear-gradient(${Math.random()*360}deg, red, orange, yellow, green, blue, indigo, violet)` : undefined }}>
          <div className="text-9xl mb-10">:(</div>
          <div className="text-2xl mb-4 text-center">Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</div>
          <div className="text-lg opacity-80">0% complete</div>
          <div className="mt-20 flex gap-10 items-center">
            <img src="https://www.mindvideo.ai/_next/image/?url=%2Fimages%2Fgenerate-video%2Fvideo_failure.webp&w=256&q=75" className="w-20 h-20 animate-bounce" />
            <div className="text-sm max-w-md">
              For more information about this issue and possible fixes, visit https://windows.com/stopcode
              <br/><br/>
              If you call a support person, give them this info:
              <br/>
              Stop code: CRITICAL_PROCESS_DIED
            </div>
          </div>
          
          {/* Flying items on BSOD */}
          {errorRemixColorful && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               {[...Array(30)].map((_, i) => (
                 <img 
                   key={i}
                   src={
                     i % 5 === 0 ? "https://files.softicons.com/download/iphone-icons/zosha-icon-pack-by-craig-philips/png/60x61/AngryBirds.png" : 
                     i % 5 === 1 ? "https://pbs.twimg.com/profile_images/1324572434314526721/AP1plNDx_400x400.jpg" :
                     i % 5 === 2 ? "https://files.softicons.com/download/object-icons/pirate-icons-by-pinchodesigns/png/128x128/Text_Pirate.png" :
                     i % 5 === 3 ? "https://files.softicons.com/download/toolbar-icons/discovery-icon-theme-by-hylke-bons/png/32x32/emotes/face-smile.png" :
                     "https://www.mindvideo.ai/_next/image/?url=%2Fimages%2Fgenerate-video%2Fvideo_failure.webp&w=256&q=75"
                   }
                   className="flying-item w-16 h-16"
                   style={{ 
                     left: `${Math.random() * 100}%`, 
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 5}s`,
                     animationDuration: `${Math.random() * 3 + 1}s`
                   }}
                 />
               ))}
            </div>
          )}
        </div>
      )}

      {/* APK Box Buddy */}
      {boxBuddyActive && (
        <div 
          className="fixed bottom-[50px] z-[300000] pointer-events-none transition-all duration-500"
          style={{ left: buddyPos }}
        >
          <img 
            src={buddyHasBox ? "https://pentestlab.blog/wp-content/uploads/2017/01/apk-download1.png" : "https://i.giphy.com/l2QZQhDgBli51PThK.gif"} 
            className="w-16 h-16 object-contain"
            alt="APK Buddy"
          />
        </div>
      )}

      {/* Falling Boxes */}
      {fallingBoxes.map(box => (
        <div 
          key={box.id}
          className="fixed z-[290000] cursor-grab active:cursor-grabbing pointer-events-auto"
          style={{ left: box.x, top: box.y }}
          onMouseDown={(e) => {
            // Simple drag logic could go here, but for now just gravity
          }}
        >
          <img src="https://files.softicons.com/download/object-icons/boxes-2-icons-by-gurato/png/48/Empty.png" className="w-12 h-12" alt="Box" />
        </div>
      ))}

      {/* Exploded APKs */}
      {explodedApks.map(apk => (
        <img 
          key={apk.id}
          src="https://cdn-icons-png.flaticon.com/512/8263/8263246.png"
          className="fixed z-[280000] w-8 h-8 pointer-events-none"
          style={{ 
            left: apk.x, 
            top: apk.y, 
            transform: `rotate(${apk.rotation}deg)` 
          }}
          alt="APK"
        />
      ))}

      {/* Error Remix Music (Hidden) */}
      {errorRemixActive && (
        <div className="fixed -top-[1000px] -left-[1000px] pointer-events-none opacity-0">
          <iframe 
            width="560" 
            height="315" 
            src="https://www.youtube.com/embed/5BZLz21ZS_Y?autoplay=1&loop=1&playlist=5BZLz21ZS_Y" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
          ></iframe>
        </div>
      )}

      {/* OMG.exe Overlay */}
      {isOmgActive && (
        <div className="fixed inset-0 z-[999999] bg-black">
          <iframe src="https://archive.org/embed/OMG.exe?autoplay=1" width="100%" height="100%" frameBorder="0" allowFullScreen></iframe>
        </div>
      )}

      {/* CHILLED windows Overlays */}
      {chilledState === 3 && (
        <div className="fixed inset-0 z-[99999] flex bg-black pointer-events-none">
          <div className="w-1/2 h-full overflow-hidden flex items-center justify-center">
            <iframe src={window.location.href} className="w-[200%] h-[200%] animate-[spin_4s_linear_infinite] border-0" />
          </div>
          <div className="w-1/2 h-full overflow-hidden flex items-center justify-center">
            <iframe src={window.location.href} className="w-[200%] h-[200%] animate-[spin_1s_linear_infinite] border-0" />
          </div>
        </div>
      )}

      {chilledState === 4 && (
        <div className="fixed inset-0 z-[999999] bg-[#0000AA] text-white font-mono p-10 flex flex-col items-start justify-start">
          <div className="max-w-3xl mx-auto mt-20">
            <div className="bg-white text-[#0000AA] px-2 py-1 inline-block mb-8">Windows</div>
            <p className="mb-4">A fatal exception 0E has occurred at 0157:BF7FF831. The current application will be terminated.</p>
            <p className="mb-4">* Press any key to terminate the current application.</p>
            <p className="mb-4">* Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.</p>
            <p className="mt-8 text-center">Press any key to continue _</p>
          </div>
        </div>
      )}

      {chilledState === 5 && (
        <div className="fixed inset-0 z-[999999] bg-white flex flex-col">
          <div className="bg-[#e0e0e0] h-10 flex items-center px-4 gap-2 border-b border-gray-400">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            <div className="ml-4 bg-white px-4 py-1 rounded-t-md text-xs font-sans border border-b-0 border-gray-400 mt-2">
              Chillled_Windows - Archive.org
            </div>
          </div>
          <div className="bg-[#f1f1f1] h-10 flex items-center px-4 gap-4 border-b border-gray-300">
            <span className="text-gray-500">⬅️</span>
            <span className="text-gray-500">➡️</span>
            <span className="text-gray-500">🔄</span>
            <div className="bg-white flex-1 rounded px-2 py-1 text-sm font-sans text-gray-700 border border-gray-300">
              https://archive.org/details/Chillled_Windows
            </div>
          </div>
          <div className="flex-1 bg-black relative">
            <video src="https://archive.org/download/Chillled_Windows/chilledwindows.mp4#t=22" autoPlay muted loop className="w-full h-full object-contain" />
            <video src="https://archive.org/download/Chillled_Windows/chilledwindows.mp4" autoPlay className="hidden" />
          </div>
        </div>
      )}

      {grandFinaleActive && (
        <div className="fixed inset-0 z-[1000000] flex flex-col items-center justify-center p-10 select-none overflow-hidden" style={{ background: grandFinaleStep >= 2 ? '#0000aa' : 'black' }}>
          {grandFinaleStep === 1 && (
            <div className="bg-black text-white p-10 border-4 border-gray-600 shadow-[0_0_50px_rgba(255,255,255,0.2)] animate-pulse">
               <h1 className="text-4xl font-mono mb-6 text-center tracking-widest uppercase">Experience the finale Sure FUCK OFF!</h1>
               <div className="w-full bg-gray-800 h-2 mt-10 overflow-hidden">
                  <div className="bg-blue-500 h-full w-full animate-progress-full"></div>
               </div>
               <p className="mt-4 text-xs text-gray-500 font-mono text-center">INITIALIZING WINDOWS 9 PC EXPERIENCE...</p>
            </div>
          )}
          
          {grandFinaleStep >= 2 && (
            <div className="w-full max-w-4xl text-white font-mono flex flex-col gap-6 animate-fade-in">
               <div className="bg-white text-[#0000aa] px-4 py-1 text-2xl font-bold inline-block self-start">Windows 9</div>
               <div className="text-xl leading-relaxed">
                  <p className="mb-4">Grand Finale initialized. User privilege: OVERRIDE.</p>
                  <p className="mb-4 text-yellow-400">Experience the finale Sure FUCK OFF!</p>
                  <p className="mb-4 opacity-70 italic text-sm">Loading legacy brand metadata...</p>
               </div>
               
               {grandFinaleStep === 3 && (
                 <div className="mt-10 border-t border-white/30 pt-10 text-[10px] uppercase tracking-tighter grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 opacity-80 overflow-y-auto max-h-[40vh] custom-scroll">
                    <div className="col-span-full text-center text-sm font-bold mb-4 border-b border-white/20 pb-2">Copyright Metadata Archive v.2026.04</div>
                    <div className="flex flex-col"><span className="font-bold">MICROSOFT CORPORATION</span><span>Windows 7, Windows 9, Photosynth, Clippy</span></div>
                    <div className="flex flex-col"><span className="font-bold">ALPHABET INC.</span><span>Google Gemini, Chrome, YouTube, Search</span></div>
                    <div className="flex flex-col"><span className="font-bold">YAHOO! INC.</span><span>News, Finance, Autos, Maps</span></div>
                    <div className="flex flex-col"><span className="font-bold">VIACOMCBS</span><span>SpongeBob SquarePants characters</span></div>
                    <div className="flex flex-col"><span className="font-bold">NINTENDO CO., LTD.</span><span>Bowser, Paper Mario, Mushrooms</span></div>
                    <div className="flex flex-col"><span className="font-bold">ROBLOX CORPORATION</span><span>Roblox Logo, Sound Effects</span></div>
                    <div className="flex flex-col"><span className="font-bold">PEPSICO</span><span>Pepsi Java, Crystal Pepsi</span></div>
                    <div className="flex flex-col"><span className="font-bold">OUTFIT7 LIMITED</span><span>Talking Tom, Talking Angela</span></div>
                    <div className="flex flex-col"><span className="font-bold">BLACKBERRY LTD.</span><span>BlackBerry 8800 Series Devices</span></div>
                    <div className="flex flex-col"><span className="font-bold">GLITCH PRODUCTIONS</span><span>The Amazing Digital Circus</span></div>
                    <div className="flex flex-col"><span className="font-bold">JAY FREEMAN (SAURIK)</span><span>Cydia App Store</span></div>
                    <div className="flex flex-col"><span className="font-bold">OPENAI / ANTHROPIC</span><span>LLM Models and Tokenizers</span></div>
                    <div className="flex flex-col"><span className="font-bold">TWITTER / X CORP.</span><span>Doge Meme property (Kabosu)</span></div>
                    <div className="flex flex-col"><span className="font-bold">CREATIVE COMMONS</span><span>Various unsplash and pixabay assets</span></div>
                    <div className="col-span-full mt-6 text-center opacity-50">All trademarks are property of their respective owners. This is a non-commercial educational simulation.</div>
                    <div className="col-span-full mt-10 text-center flex flex-col gap-2">
                      <button className="bg-white text-[#0000aa] py-2 px-6 font-bold hover:bg-gray-200 transition-colors" onClick={() => { playSound('click'); setGrandFinaleActive(false); setGrandFinaleStep(0); }}>REBOOT SYSTEM</button>
                      <p className="text-[8px] animate-pulse">PRESS ENTER OR CLICK BUTTON TO ESCAPE FINALE</p>
                    </div>
                 </div>
               )}
            </div>
          )}
        </div>
      )}

      </div>
    </div>
    </OSContext.Provider>
  );
}
