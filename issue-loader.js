//Global data tables
var authors = {};//Contains per author data
var posts = [];//Contains every posts

//Load and display a new issue
function loadIssue(url) {
    $.get(url).done(function(data) {
        //Clear data
        authors = {};
        posts = [];
        //Load and display issue
        parseData(data, displayIssue);
    });
}

//Display an issue given the data loaded
function displayIssue(id, title, author, authors, posts) {
    //TODO
}

//gets general data from github API
function parseData(json, callback) {
    //Issue data
    var issueTitle = json.title;
    var issueId = json.number

    //Original author data
    var author = json.user.login;
    var content = json.body;
    var avatar = json.user.avatar_url;
    var id = json.id;
    var words = wordCount(content);

    //update data tables
    authors[author] = {"words":words,"avatar":avatar}
    posts.push({"author":author,"content":content});
    
    //load comments
    $.get(json.comments_url).done(function(data) {
        parseComments(data);
        callback(issueId, issueTitle, author, authors, posts);//Done reading data
    });
}

//Reads comments from github API
function parseComments(json) {
    for(var i=0; i<json.length; i++) {
    
        //Per comment data
        var comment = json[i];
        var author = comment.user.login;
        var content = comment.body;
        var avatar = comment.user.avatar_url;
        var id = comment.id;
        var words = wordCount(content);

        //Create a new author entry if necessary
        if(!authors[author]) {
            authors[author] = {"words":0,"avatar":avatar}
        }
        
        //update data tables
        authors[author].words += words;
        posts.push({"author":author,"content":content});
        
    }
}

//Words count
function wordCount(sentence) {
    var matches = sentence.match(/(\w+)/g);//Group words
    var words = (matches ? matches.length : 0);//Matches is null for empty or white string
}
