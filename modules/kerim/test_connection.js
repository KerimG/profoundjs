function test_connection() {
    pjs.defineDisplay("display", "test_connection.json");

    var adress = 'Task Force IT-Consulting GmbH, Fallgatter 3, 44369 Dortmund';

    while (!exit) {
        display.screen.execute();

        if (articleid.trim().length > 0) {
            console.log(true);
            articledescription = 'Rucksack';
            descriptionvisible = true;
        } else {
            reset();
        }
        if (pjs.error()) {
            pjs.dump(true);
        }
    }
} exports.run = test_connection;

function reset() {
    descriptionvisible = false;
}