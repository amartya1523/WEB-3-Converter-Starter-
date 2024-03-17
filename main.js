import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  formatUnits,
} from "viem";
import { polygonAmoy } from "viem/chains";


const pubClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});


const walletClient = createWalletClient({
  chain: polygonAmoy,
  transport: custom(window.ethereum),
});

const btn = document.getElementById("connect"); 
const balance = document.getElementById("balance"); 
const select = document.getElementById("convert"); 
const converted = document.getElementById("converted"); 
let connected = false; 


const convert = async (to) => {
  
  if (!connected) {
      console.log("Not connected");
      return;
  }

  
  const res = await fetch(
      `https://api.binance.com/api/v3/avgPrice?symbol=MATIC${to}`
  );
  const data = await res.json();
  const price = data.price;

  console.log("MATIC in", to, ":", price);
  converted.innerHTML = price + " " + to; 
};


const connect = async () => {
  const [address] = await walletClient.requestAddresses(); 
  connected = true; 
  btn.innerHTML = "Connected"; 

  console.log("Connected with address: ", address);


  const bal = await pubClient.getBalance({
      address,
  });
  balance.innerHTML = formatUnits(bal, 18) + " MATIC"; 
  console.log("Balance:", formatUnits(bal, 18) + " MATIC");


  select.value = "BTC";
  convert("BTC");
};


window.addEventListener("load", async () => {
  
  if (window.ethereum) {
      try {
          connect();
      } catch (error) {
          console.error("User denied account access", error);
      }
  }
});


btn.addEventListener("click", connect);


select.addEventListener("change", async (e) => {
  
  const selectedOption = e.target.value;
  console.log("Selected option id:", selectedOption);

  
  convert(selectedOption);
});
