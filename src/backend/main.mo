import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  type SpeedUnit = {
    #kph;
    #mph;
  };

  type ColorTheme = {
    #dark;
    #light;
    #colorful;
  };

  type Settings = {
    speedUnit : SpeedUnit;
    colorTheme : ColorTheme;
    speedometerSkin : Text;
  };

  let settings = Map.empty<Principal, Settings>();

  public query ({ caller }) func getSettings() : async Settings {
    switch (settings.get(caller)) {
      case (?userSettings) { userSettings };
      case (null) {
        {
          speedUnit = #kph;
          colorTheme = #dark;
          speedometerSkin = "classic";
        };
      };
    };
  };

  public shared ({ caller }) func setSettings(newSettings : Settings) : async () {
    settings.add(caller, newSettings);
  };

  public shared ({ caller }) func resetSettings() : async () {
    settings.remove(caller);
  };

  public query ({ caller }) func toText() : async Text {
    "Motoko backend for Speedometer";
  };
};
