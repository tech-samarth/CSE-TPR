({
  run: function(formId) {
    if (!formId || !String(formId).trim()) {
      throw new Error("A Google Form ID is required.");
    }

    var candidates = [
      "Ravulapalli Pavani",
      "Sang Singh Bhati",
      "Rupam Biswas",
      "Manas Tripathi",
      "Aishee Mandal",
      "Machiraju"
    ];

    var counts = {};
    candidates.forEach(function(name) {
      counts[name] = 0;
    });

    var form = FormApp.openById(String(formId).trim());
    var responses = form.getResponses();
    var totalVotes = 0;

    responses.forEach(function(response) {
      response.getItemResponses().forEach(function(itemResponse) {
        var answer = itemResponse.getResponse();
        var values = Array.isArray(answer) ? answer : [answer];

        values.forEach(function(value) {
          if (value === null || value === undefined) return;

          var selected = String(value).trim().toLowerCase();
          var matchedName = candidates.find(function(name) {
            return name.toLowerCase() === selected;
          });

          if (matchedName) {
            counts[matchedName]++;
            totalVotes++;
          }
        });
      });
    });

    var results = candidates.map(function(name) {
      return { name: name, votes: counts[name] };
    }).sort(function(a, b) {
      return b.votes - a.votes || a.name.localeCompare(b.name);
    });

    Logger.log("========================================");
    Logger.log("          GOOGLE FORM VOTE COUNT");
    Logger.log("========================================");
    Logger.log("Form title: " + form.getTitle());
    Logger.log("Total form submissions: " + responses.length);
    Logger.log("Total candidate votes counted: " + totalVotes);
    Logger.log("----------------------------------------");

    results.forEach(function(result, index) {
      var percentage = totalVotes
        ? (result.votes / totalVotes * 100).toFixed(2)
        : "0.00";

      Logger.log(
        (index + 1) + ". " + result.name +
        " | Votes: " + result.votes +
        " | " + percentage + "%"
      );
    });

    Logger.log("----------------------------------------");
    Logger.log("Expected maximum if every submission casts 3 votes: " +
      (responses.length * 3));
    Logger.log("========================================");

    return results;
  }
})
