import json
import os
from pathlib import Path

# JSON file path for persistence
# Use absolute path based on file location
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SETTINGS_FILE = BASE_DIR / "system_settings.json"

class SettingsStore:
    def __init__(self):
        self._settings = {
            "maintenance_mode": False,
            "registration_open": True
        }
        self.load()

    def load(self):
        """Load settings from JSON file."""
        if SETTINGS_FILE.exists():
            try:
                with open(SETTINGS_FILE, "r") as f:
                    self._settings.update(json.load(f))
            except Exception as e:
                print(f"Error loading system settings: {e}")

    def save(self):
        """Save settings to JSON file."""
        try:
            with open(SETTINGS_FILE, "w") as f:
                json.dump(self._settings, f, indent=4)
        except Exception as e:
            print(f"Error saving system settings: {e}")

    @property
    def maintenance_mode(self) -> bool:
        return self._settings.get("maintenance_mode", False)

    @maintenance_mode.setter
    def maintenance_mode(self, value: bool):
        self._settings["maintenance_mode"] = value
        self.save()

    @property
    def registration_open(self) -> bool:
        return self._settings.get("registration_open", True)

    @registration_open.setter
    def registration_open(self, value: bool):
        self._settings["registration_open"] = value
        self.save()

# Singleton instance
settings_store = SettingsStore()
