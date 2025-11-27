
# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Use unstable for latest Flutter support
  channel = "unstable";

  packages = [
    # From shell.nix
    pkgs.flutter
    pkgs.pkg-config
    pkgs.gtk3
    pkgs.libglvnd
    pkgs.pcre2
    pkgs.util-linux
    pkgs.libselinux
    pkgs.libxkbcommon
    pkgs.libtiff
    pkgs.cairo
    pkgs.gdk-pixbuf
    pkgs.pango

    # From previous attempts
    pkgs.cmake
    pkgs.ninja
    pkgs.clang
    pkgs.webkitgtk
    pkgs.glib
    pkgs.pcre
    pkgs.libepoxy
    pkgs.fontconfig
    pkgs.libsepol
    pkgs.libthai
    pkgs.xorg.libX11
    pkgs.xorg.libXext
    pkgs.xorg.libXinerama
    pkgs.xorg.libXi
    pkgs.xorg.libXrandr
    pkgs.xorg.libXcursor
    pkgs.xorg.libXdamage
    pkgs.xorg.libXfixes
    # Add chromium for web-server support
    pkgs.chromium
  ];

  # Replicate LD_LIBRARY_PATH from shell.nix
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [
      pkgs.gtk3
      pkgs.libglvnd
      pkgs.pcre2
      pkgs.glib
      pkgs.libxkbcommon
      pkgs.libtiff
      pkgs.cairo
      pkgs.gdk-pixbuf
      pkgs.pango
      pkgs.util-linux
      pkgs.libselinux
    ];
    # Make chromium available to Flutter
    CHROME_EXECUTABLE = "${pkgs.chromium}/bin/chromium";
  };

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [];

    # Enable previews
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "flutter" "run" "-d" "web-server" "--web-port=$PORT" ];
          cwd = "urbancoll";
          manager = "web";
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {};
      # Runs when the workspace is (re)started
      onStart = {};
    };
  };
}
