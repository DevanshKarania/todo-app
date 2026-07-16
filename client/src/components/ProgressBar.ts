export function ProgressBar(completed: number, total: number): string {
    const percent = total === 0 ? 0 : Math.round(completed*100 / total);

    return `
        <section class="section-progress">
            <h2>Progress Bar - ${completed}/${total}</h2>

            <div class="progress-wrapper">
                <progress id="progress-bar" value=${percent} max="100"></progress>

                <span id="progress-text">${percent}%</span>
            </div>
        </section>
    `;
}