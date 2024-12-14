# Default target
.PHONY: help
help:
	@echo "Usage:"
	@echo "  make [command]"
	@echo ""
	@echo "Commands:"
	@echo "  ptau        Usage 'make zkeky TARGET=test POWER=16'"
	@echo "  build"
	@echo "  key"
	@echo "  prove"
	@echo "  verify"
	@echo "  clean       Remove the working directory"

# Variables
TARGET ?= hash_mimc
POWER ?= 12
WORKDIR = work/$(TARGET)
PROTOCOL ?= plonk
PTAU = powersOfTau28_hez_final_12.ptau

.PHONY: ptau
ptau:
	wget -P $(WORKDIR) https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_12.ptau

.PHONY: build
build:
	circom circuit/${TARGET}.circom --r1cs --wasm --sym --c --output $(WORKDIR)
	npx snarkjs r1cs export json $(WORKDIR)/$(TARGET).r1cs $(WORKDIR)/$(TARGET).r1cs.json

.PHONY: key
key:
	npx snarkjs $(PROTOCOL) setup $(WORKDIR)/$(TARGET).r1cs $(WORKDIR)/$(PTAU) $(WORKDIR)/circuit_final.zkey
	npx snarkjs zkey export verificationkey $(WORKDIR)/circuit_final.zkey $(WORKDIR)/verification_key.json

.PHONY: prove
prove:
	node $(WORKDIR)/$(TARGET)_js/generate_witness.js $(WORKDIR)/$(TARGET)_js/$(TARGET).wasm input/$(TARGET).json $(WORKDIR)/witness.wtns
	npx snarkjs $(PROTOCOL) prove $(WORKDIR)/circuit_final.zkey $(WORKDIR)/witness.wtns $(WORKDIR)/proof.json $(WORKDIR)/public.json

.PHONY: verify
verify:
	npx snarkjs $(PROTOCOL) verify $(WORKDIR)/verification_key.json $(WORKDIR)/public.json $(WORKDIR)/proof.json

.PHONY: clean
clean:
	@if [ -d "$(WORKDIR)" ]; then \
		echo "Removing $(WORKDIR)..."; \
		rm -rf $(WORKDIR); \
	else \
		echo "$(WORKDIR) does not exist, nothing to clean."; \
	fi

