{
  description = "Tabledit FastAPI backend";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};

        pythonEnv = pkgs.python3.withPackages (ps: with ps; [
          fastapi
          uvicorn
          aiosqlite
          pydantic
        ]);

        tabledit-backend = pkgs.stdenvNoCC.mkDerivation {
          pname = "tabledit-backend";
          version = "0.1.0";
          src = ./.;

          buildInputs = [ pythonEnv ];

          installPhase = ''
            mkdir -p $out/share/tabledit-backend $out/bin
            cp -r . $out/share/tabledit-backend/

            makeWrapper ${pythonEnv}/bin/python $out/bin/tabledit-backend \
              --set PYTHONPATH "$out/share/tabledit-backend" \
              --add-flags "-m uvicorn" \
              --add-flags "main:app" \
              --add-flags "--host 0.0.0.0" \
              --add-flags "--port \$PORT" \
              --run "cd $out/share/tabledit-backend"
          '';

          nativeBuildInputs = [ pkgs.makeWrapper ];
        };
      in
      {
        packages.default = tabledit-backend;

        apps.default = {
          type = "app";
          program = "${tabledit-backend}/bin/tabledit-backend";
        };

        devShells.default = pkgs.mkShell {
          packages = [ pythonEnv pkgs.uv ];
        };
      });
}
