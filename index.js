var pkcs11js = require("pkcs11js");
var crypto = require('crypto');
var bigInt = require("big-integer");
const { join } = require("path");

console.log("TESTE ================================ \n")
console.log(hexStringToByteArray("00000000034E829E"));
console.log("TESTE ================================ \n")

const DIGITS_POWER = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000];

var pkcs11 = new pkcs11js.PKCS11();
pkcs11.load("/usr/local/lib/vault-pkcs11.so");
pkcs11.C_Initialize();



try {
    username="16525176000";
    seed = "AA46710000fC9EA74bE7E08AC44942BF6D9AA756";
    slot = 0;
    windo = 30;
    digits = 6;
    password = username + ":" + getCurrentPin(seed,digits + "", windo);
    console.log("Password " + password);

    
    // Getting info about PKCS11 Module
    var module_info = pkcs11.C_GetInfo();
    console.log(module_info);

    // Getting list of slots
    var slots = pkcs11.C_GetSlotList(true);
    var slot = slots[0];
    // var slot = 0;
    console.log(slot);

    // Getting info about slot
    var slot_info = pkcs11.C_GetSlotInfo(slot);
    // Getting info about token
    var token_info = pkcs11.C_GetTokenInfo(slot);

    // Getting info about Mechanism
    var mechs = pkcs11.C_GetMechanismList(slot);
    var mech_info = pkcs11.C_GetMechanismInfo(slot, mechs[0]);
    console.log(mech_info);

    var session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);
    
    // Getting info about Session
    var info = pkcs11.C_GetSessionInfo(session);
    console.log(info);
    
    pkcs11.C_Login(session, pkcs11js.CKU_USER, password);

    /**
     * Your app code here
     */
    
    pkcs11.C_Logout(session);
    pkcs11.C_CloseSession(session);
}
catch(e){
    console.error(e);
}
finally {
    pkcs11.C_Finalize();
}


function getCurrentPin(seed, returnDigits, window){
    TO = 0;
    X = 30;

    steps = "0";
    var date = new Date();
    testTime = parseInt(date.getTime() /1000);
    console.log("testTime: "+testTime);
    T = (testTime - TO) / X;
    console.log("T: "+parseInt(T));
    // steps =  Buffer(parseInt(T.toString())).toString('hex');
    // steps = BigInt(parseInt(testTime),16);
    // steps = Buffer.from(T.toString()).toString('HEX');
    steps = parseInt(T).toString(16).toLocaleUpperCase();
    console.log("steps: "+steps);
    while (steps.length < 16) {
        steps = "0" + steps;
    }

    return generateTOTP(seed, steps, "6", "HmacSHA1");
}

function generateTOTP(key, time, returnDigits, cryptos){
    codeDigits = parseInt(returnDigits);
    result = null;
    while (time.length < 16) {
        time = "0" + time;
    }
    console.log(time);
    msg = hexStringToByteArray(time);
    k = hexStringToByteArray(key);
    console.log(msg);
    console.log(k);
    hash = hmac_sha(cryptos, k, msg);
    console.log("Hash: "+hash);
    for (let index = 0; index < hash.length; index++) {
        const element = hash[index];
        console.log(element);
        
    }

    offset = hash[hash.length - 1] & 0xf
    binary
    = ((hash[offset] & 0x7f) << 24)
    | ((hash[offset + 1] & 0xff) << 16)
    | ((hash[offset + 2] & 0xff) << 8)
    | (hash[offset + 3] & 0xff);

    otp = binary % DIGITS_POWER[codeDigits];

    result = otp.toString();
    while (result.length < codeDigits) {
        result = "0" + result;
    }
    console.log(result);
    console.log("=============== EXIT TOTP ===============")
    return result;

}

function hmac_sha(crypto_algotirhm, keyBytes, text){
   

    macKey = crypto.createSecretKey(keyBytes, "RAW");
    hmac = crypto.createHmac("sha1",macKey).update(text).digest();
    console.log(hmac);
    return hmac;

}

function hexStringToByteArray(hexString) {
    if (hexString.length % 2 !== 0) {
        throw "Must have an even number of hex digits to convert to bytes";
    }/* w w w.  jav  a2 s .  c o  m*/
    var numBytes = hexString.length / 2;
    var byteArray = new Int8Array(numBytes);
    for (var i=0; i<numBytes; i++) {
        byteArray[i] = parseInt(hexString.substr(i*2, 2), 16);
    }
    return byteArray;
}

function hexStr2Bytes(hexString){
    bArray = new BigInt("10" + hexString, 16);
}

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }
