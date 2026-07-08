{
  description = "Tabledit frontend + backend";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        lib = nixpkgs.lib;
        pkgs = nixpkgs.legacyPackages.${system};

        # -----------------------------------------------------------------
        # Backend
        # -----------------------------------------------------------------
        backendPython = pkgs.python3.withPackages (ps: with ps; [
          fastapi
          uvicorn
          aiosqlite
          pydantic
        ]);

        backend = pkgs.stdenvNoCC.mkDerivation {
          pname = "tabledit-backend";
          version = "0.1.0";
          src = ./backend;

          nativeBuildInputs = [ pkgs.makeWrapper ];
          buildInputs = [ backendPython ];

          installPhase = ''
            mkdir -p $out/share/tabledit-backend $out/bin
            cp -r . $out/share/tabledit-backend/

            makeWrapper ${backendPython}/bin/python $out/bin/tabledit-backend \
              --set-default PORT 8000 \
              --set-default DB_PATH "db.json" \
              --set PYTHONPATH "$out/share/tabledit-backend" \
              --add-flags "-m uvicorn" \
              --add-flags "main:app" \
              --add-flags "--host 0.0.0.0" \
              --add-flags "--port \$PORT"
          '';
        };

        # -----------------------------------------------------------------
        # Frontend
        # -----------------------------------------------------------------
        frontend = pkgs.buildNpmPackage {
          pname = "tabledit-frontend";
          version = "0.1.0";
          src = ./.;

          # To point the frontend at a different backend origin, override this
          # when building: VITE_API_URL=http://localhost:9000 nix build .#frontend --impure
          VITE_API_URL = builtins.getEnv "VITE_API_URL";
          VITE_BASE = "/";

          npmDepsHash = "sha256-clP1qW1UuFPqCxjrA6PZWu+QrOuutoDMRqps3Mjc+zY=";
          npmFlags = [ "--legacy-peer-deps" ];

          installPhase = ''
            mkdir -p $out/share/tabledit-frontend $out/bin
            cp -r dist $out/share/tabledit-frontend/

            makeWrapper ${pkgs.python3}/bin/python $out/bin/tabledit-frontend \
              --set-default FRONTEND_PORT 8080 \
              --add-flags "-m http.server" \
              --add-flags "\$FRONTEND_PORT" \
              --run "cd $out/share/tabledit-frontend/dist"
          '';
        };
      in
      {
        packages = {
          inherit backend frontend;
          default = backend;
        };

        apps = {
          backend = {
            type = "app";
            program = "${backend}/bin/tabledit-backend";
          };
          frontend = {
            type = "app";
            program = "${frontend}/bin/tabledit-frontend";
          };
          default = {
            type = "app";
            program = "${backend}/bin/tabledit-backend";
          };
        };

        devShells.default = pkgs.mkShell {
          packages = [ backendPython pkgs.uv pkgs.nodejs ];
        };
      });
}
