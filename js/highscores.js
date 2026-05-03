class Highscores {
    constructor() {
        this.key = "goatGameHighscores";
        this.maxScores = 10;
    }

    getAll() {
        const saved = localStorage.getItem(this.key);
        return saved ? JSON.parse(saved) : [];
    }

    saveNew(score) {
    const highscoresArea = document.getElementById("highscoresArea");
    highscoresArea.style.display = "none";

    const addDiv = document.getElementById("addNewHighscore");
    addDiv.style.display = "block";

    const saveButton = addDiv.querySelector("#saveHighscorebtn");
    const nameInput = addDiv.querySelector("input");



        return new Promise((resolve) => {
            saveButton.onclick = () => {
                const playerName = nameInput.value.trim() || "Anonym";

                let scores = this.getAll();
                scores.push({
                    name: playerName,
                    score: score,
                });

                scores.sort((a, b) => b.score - a.score);
                scores = scores.slice(0, this.maxScores);
                localStorage.setItem(this.key, JSON.stringify(scores));


                addDiv.style.display = "none";
                nameInput.value = "";

                highscoresArea.style.display = "block";
                this.render();

                resolve(scores);
            };
        });
    }

    render() {
        const tbody = document.getElementById("highscoreList");
        tbody.innerHTML = "";

        const scores = this.getAll();

        if (scores.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3">Earn at least 10 points and start filling the highscore list!</td></tr>`;
            return;
        }

        scores.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}.</td>
                <td> ${entry.name}</td>
                <td> ${entry.score}</td>
            `;
            tbody.appendChild(row);
        });
    }
}