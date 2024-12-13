pragma circom 2.0.0;

include "../circomlib/circuits/eddsamimc.circom";

template Hash () {  

   signal input in;  
   signal output out;  

   component hasher;
   hasher = MiMC7(91);
   hasher.x_in <== in;
   hasher.k <== 0;
   
   out <== hasher.out;
}

component main = Hash();
