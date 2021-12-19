const homeCarouselHolder = document.querySelector(".homeCarouselHolder");
const homeArrowLeft = document.querySelector(".homeArrowLeft");
const homeArrowRight = document.querySelector(".homeArrowRight");


const apiLinkAllPosts = "https://ehtoday.one/assignments/dand/wp-json/wp/v2/posts?_embed&per_page=20";

let post1 = 0;
let post2 = 1;
let post3 = 2;
let post4 = 3;

async function allPostFetcher(inputApiLink) {

    try {

        const firstCall = await fetch(inputApiLink);
        const firstResponse = await firstCall.json();

        const totalNumberOfPostsAvailable = firstCall.headers.get('x-wp-total');
        const postsBeingShown = firstResponse.length;

        homeCarouselHolder.innerHTML = "";
        homeArrowLeft.style.display = "block";
        homeArrowRight.style.display = "block";

        for (let i = 0; i < firstResponse.length; i++) {

            let date1 = firstResponse[post1].date;
            date1 = date1.split('T')[0];

            let date2 = firstResponse[post2].date;
            date2 = date2.split('T')[0];

            let date3 = firstResponse[post3].date;
            date3 = date3.split('T')[0];

            let date4 = firstResponse[post4].date;
            date4 = date4.split('T')[0];

            homeCarouselHolder.innerHTML = `
            <a href="blogspecific.html?post_id=${firstResponse[post1].id}" class="homePostBlock1">
                <div class="homePostBlock">
                    <p>${date1}</p>
                    <p>${firstResponse[post1]._embedded.author[0].name}</p>
                    <h2>${firstResponse[post1].title.rendered}</h2>
                </div>
            </a>
            <a href="blogspecific.html?post_id=${firstResponse[post2].id}" class="homePostBlock2">
                <div class="homePostBlock">
                    <p>${date2}</p>
                    <p>${firstResponse[post2]._embedded.author[0].name}</p>
                    <h2>${firstResponse[post2].title.rendered}</h2>
                </div>
            </a>
            <a href="blogspecific.html?post_id=${firstResponse[post3].id}" class="homePostBlock3">
                <div class="homePostBlock">
                    <p>${date3}</p>
                    <p>${firstResponse[post3]._embedded.author[0].name}</p>
                    <h2>${firstResponse[post3].title.rendered}</h2>
                </div>
            </a>
            <a href="blogspecific.html?post_id=${firstResponse[post4].id}" class="homePostBlock4">
                <div class="homePostBlock">
                    <p>${date4}</p>
                    <p>${firstResponse[post4]._embedded.author[0].name}</p>
                    <h2>${firstResponse[post4].title.rendered}</h2>
                </div>
            </a>
            `;

            if (post1 === 0) {
                 homeArrowLeft.classList.add("homeArrowsInactive");
            } else {
                homeArrowLeft.classList.remove("homeArrowsInactive");
            }

            if (post4 === 11) {
                homeArrowRight.classList.add("homeArrowsInactive");
            } else {
                homeArrowRight.classList.remove("homeArrowsInactive");
            }

        }

    } catch(error) {
        homeCarouselHolder.innerHTML = `<p>An error has occured when fetching the latest posts, please try again or contact us!</p>`;
    }

};

allPostFetcher(apiLinkAllPosts);

homeArrowLeft.addEventListener("click", leftArrowPostMover);
homeArrowLeft.addEventListener("click", () => {allPostFetcher(apiLinkAllPosts)});
homeArrowRight.addEventListener("click", rightArrowPostMover);
homeArrowRight.addEventListener("click", () => {allPostFetcher(apiLinkAllPosts)});

function leftArrowPostMover() {

    if (post1 > 0) {
        post1 -= 4;
        post2 -= 4;
        post3 -= 4;
        post4 -= 4;
    }

    if (post1 === 0) {
        homeArrowLeft.classList.add("homeArrowsInactive");
    } else {
        homeArrowLeft.classList.remove("homeArrowsInactive");
    }

    if (post4 === 11) {
        homeArrowRight.classList.add("homeArrowsInactive");
    } else {
        homeArrowRight.classList.remove("homeArrowsInactive");
    }

}

function rightArrowPostMover() {
    
    if (post4 < 11) {
        post1 += 4;
        post2 += 4;
        post3 += 4;
        post4 += 4;
    }

    if (post4 === 11) {
        homeArrowRight.classList.add("homeArrowsInactive");
    } else {
        homeArrowRight.classList.remove("homeArrowsInactive");
    }

    if (post1 === 0) {
        homeArrowLeft.classList.add("homeArrowsInactive");
    } else {
        homeArrowLeft.classList.remove("homeArrowsInactive");
    }

}
