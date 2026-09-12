const cookieBanner = document.getElementById("cookieBanner");
const rejectBtn = document.getElementById("rejectBtn");
const acceptBtn = document.getElementById("acceptBtn");

// REJECT ALL
rejectBtn.addEventListener("click", function () {

    localStorage.setItem("consentChoice", "rejected");

    cookieBanner.style.display = "none";

    const rejectionTime = new Date().toISOString();

    console.log("🔴 CONSENT REJECTED");
    console.log("Rejection time:", rejectionTime);

    alert("Your privacy preference has been saved.");

    // Start the controlled tracking simulation
    setTimeout(simulateTracker, 2000);
});


// ACCEPT ALL
acceptBtn.addEventListener("click", function () {

    localStorage.setItem("consentChoice", "accepted");

    cookieBanner.style.display = "none";

    console.log("🟢 CONSENT ACCEPTED");
});


// CONTROLLED HACKATHON SIMULATION
function simulateTracker() {

    const trackerUrl =
        "https://tracker.consentledger-demo.invalid/collect";

    console.log("⚠️ CONTROLLED SIMULATION");
    console.log("Simulated tracker request:", trackerUrl);
    console.log("Time:", new Date().toISOString());

    fetch(trackerUrl, {
        method: "GET",
        mode: "no-cors"
    }).catch(function () {
        console.log("Simulation request completed/attempted.");
    });
}