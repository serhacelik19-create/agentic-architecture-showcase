import os
import json

arb_files = [
    'app_en.arb', 'app_tr.arb', 'app_de.arb', 'app_it.arb', 'app_es.arb', 'app_fr.arb'
]

translations = {
    'en': {
        "customTimerChannelName": "Active Timer",
        "customTimerChannelDescription": "Cooking timer status",
        "timerCookingDescription": "Cooking...\nYou will be notified when it's done.",
        "chefVisionActiveTimer": "ChefVision Active Timer",
        "timerCookingTitle": "{title} is cooking..."
    },
    'tr': {
        "customTimerChannelName": "Özel Aktif Sayaç",
        "customTimerChannelDescription": "Yemek pişirme sayacı durumu",
        "timerCookingDescription": "Pişiriliyor...\nSüre dolduğunda bildirim alacaksınız.",
        "chefVisionActiveTimer": "ŞefVision Aktif Sayaç",
        "timerCookingTitle": "{title} pişiyor..."
    },
    'de': {
        "customTimerChannelName": "Aktiver Timer",
        "customTimerChannelDescription": "Status des Kochtimers",
        "timerCookingDescription": "Wird gekocht...\nSie werden benachrichtigt, wenn es fertig ist.",
        "chefVisionActiveTimer": "ChefVision Aktiver Timer",
        "timerCookingTitle": "{title} wird gekocht..."
    },
    'it': {
        "customTimerChannelName": "Timer Attivo",
        "customTimerChannelDescription": "Stato del timer di cottura",
        "timerCookingDescription": "In cottura...\nSarai avvisato quando è pronto.",
        "chefVisionActiveTimer": "Timer Attivo ChefVision",
        "timerCookingTitle": "{title} è in cottura..."
    },
    'es': {
        "customTimerChannelName": "Temporizador Activo",
        "customTimerChannelDescription": "Estado del temporizador de cocción",
        "timerCookingDescription": "Cocinando...\nSerás notificado cuando termine.",
        "chefVisionActiveTimer": "Temporizador Activo ChefVision",
        "timerCookingTitle": "{title} se está cocinando..."
    },
    'fr': {
        "customTimerChannelName": "Minuterie Active",
        "customTimerChannelDescription": "État de la minuterie de cuisson",
        "timerCookingDescription": "Cuisson en cours...\nVous serez averti quand ce sera prêt.",
        "chefVisionActiveTimer": "Minuterie Active ChefVision",
        "timerCookingTitle": "{title} est en cours de cuisson..."
    }
}

base_dir = r"c:\Users\serhat\Desktop\tarif\mobile\lib\l10n"

for filename in arb_files:
    lang = filename.split('_')[1].split('.')[0]
    filepath = os.path.join(base_dir, filename)
    
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Update with new keys
        for key, value in translations[lang].items():
            data[key] = value
            
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
print("ARB files updated successfully.")
