
const contractAddress = "0x61eaC74029CBf9F450C6c5CD602938382f36B567";

const contractABI = [
    "function registerParcel(string _trackingId, string _destination)",
    "function updateStatus(string _trackingId, string _newStatus)",
    "function trackParcel(string _trackingId) view returns (string destination, string status, bool exists)"
];

const connectButton = document.getElementById("connectButton");
const walletInfo = document.getElementById("walletInfo");
const message = document.getElementById("message");
const result = document.getElementById("result");
let provider;
let signer;
let contract;

connectButton.addEventListener("click", async function () {
    if (typeof window.ethereum === "undefined") {
        message.textContent = "Please install MetaMask first.";
        return;
    }

    try {
        await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        const network = await provider.getNetwork();

        if (network.chainId !== 11155111n) {
            message.textContent = "Please switch MetaMask to Sepolia Test Network.";
            return;
        }

        contract = new ethers.Contract(contractAddress, contractABI, signer);

        walletInfo.textContent = "Connected wallet: " + await signer.getAddress();
        message.textContent = "MetaMask connected to Sepolia successfully.";
    } catch (error) {
        message.textContent = "Connection failed: " + (error.reason || error.message);
    }
});

document.getElementById("registerButton").addEventListener("click", async function () {
    const trackingId = document.getElementById("trackingId").value.trim();
    const destination = document.getElementById("destination").value.trim();

    if (!contract) {
        message.textContent = "Please connect MetaMask first.";
        return;
    }

    if (!trackingId || !destination) {
        message.textContent = "Please enter the tracking ID and destination.";
        return;
    }

    try {
        message.textContent = "Registering parcel. Please confirm in MetaMask.";

        const transaction = await contract.registerParcel(trackingId, destination);
        message.textContent = "Transaction submitted. Waiting for confirmation...";

        await transaction.wait();

        message.textContent = "Parcel registered successfully!";
    } catch (error) {
        message.textContent = "Registration failed: " + (error.reason || error.shortMessage || error.message);
    }
});

document.getElementById("updateButton").addEventListener("click", async function () {
    const trackingId = document.getElementById("updateId").value.trim();
    const newStatus = document.getElementById("newStatus").value.trim();

    if (!contract) {
        message.textContent = "Please connect MetaMask first.";
        return;
    }

    if (!trackingId || !newStatus) {
        message.textContent = "Please enter the tracking ID and new status.";
        return;
    }

    try {
        message.textContent = "Updating parcel status. Please confirm in MetaMask.";

        const transaction = await contract.updateStatus(trackingId, newStatus);
        message.textContent = "Transaction submitted. Waiting for confirmation...";

        await transaction.wait();

        message.textContent = "Parcel status updated successfully!";
    } catch (error) {
        message.textContent = "Status update failed: " + (error.reason || error.shortMessage || error.message);
    }
});

document.getElementById("trackButton").addEventListener("click", async function () {
    const trackingId = document.getElementById("searchId").value.trim();

    if (!contract) {
        message.textContent = "Please connect MetaMask first.";
        return;
    }

    if (!trackingId) {
        message.textContent = "Please enter a tracking ID.";
        return;
    }

    try {
        message.textContent = "Searching for parcel...";
        result.textContent = "";

        const parcel = await contract.trackParcel(trackingId);

        if (!parcel[2]) {
            result.textContent = "Parcel not found.";
        } else {
            result.textContent =
                "Destination: " + parcel[0] +
                " | Status: " + parcel[1];
        }

        message.textContent = "Parcel search completed.";
    } catch (error) {
        message.textContent = "Tracking failed: " + (error.reason || error.shortMessage || error.message);
    }
});
