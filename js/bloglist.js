const bloglistPostHolder = document.querySelector(".bloglistPostHolder");
const loadMorePostsButton = document.querySelector(".loadMorePostsButton");
const postCountTracker = document.querySelector(".postCountTracker");
const bloglistH1 = document.querySelector(".bloglistH1");

const apiLinkAllPosts = "https://ehtoday.one/assignments/dand/wp-json/wp/v2/posts?_embed";

async function allPostFetcher(inputApiLink) {

    try {

        const firstCall = await fetch(inputApiLink);
        const firstResponse = await firstCall.json();
        firstResponse.reverse();

        const totalNumberOfPostsAvailable = firstCall.headers.get('x-wp-total');
        const postsBeingShown = firstResponse.length;

        bloglistH1.innerHTML = "Posts";
        bloglistPostHolder.innerHTML = "";
        loadMorePostsButton.style.display = "flex";
        postCountTracker.innerHTML = `
            <p>Showing ${postsBeingShown} out of ${totalNumberOfPostsAvailable}</p>
        `;


        for (let i = 0; i < firstResponse.length; i++) {

            let date = firstResponse[i].date;
            date = date.split('T')[0];

            bloglistPostHolder.innerHTML += `
            <a href="blogspecific.html?post_id=${firstResponse[i].id}">
                <div class="bloglistPostBlock">
                    <p>${date}</p>
                    <p>${firstResponse[i]._embedded.author[0].name}</p>
                    <h2>${firstResponse[i].title.rendered}</h2>
                </div>
            </a>
            `;
        }

    } catch(error) {
        bloglistPostHolder.innerHTML = `<p>An error has occured when fetching the blog list, please try again or contact us!</p>`;
    }

};

allPostFetcher(apiLinkAllPosts);

let postsPerPageNumber = 20;

loadMorePostsButton.addEventListener("click", postCleaner);
loadMorePostsButton.addEventListener("click", () => {allPostFetcher(apiLinkAllPosts + `&per_page=${postsPerPageNumber}`)});
loadMorePostsButton.addEventListener("click", postPerPageNumberIncrease);

function postCleaner() {
    bloglistPostHolder.innerHTML = "";
};

function postPerPageNumberIncrease() {
    postsPerPageNumber += 10;
};

// ADD A LOADER