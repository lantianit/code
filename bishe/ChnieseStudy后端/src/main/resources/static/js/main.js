document.addEventListener('DOMContentLoaded', function () {
    // 加载视频列表
    loadVideoList();

    // 搜索按钮点击事件
    document.getElementById('search-button').addEventListener('click', function () {
        const searchTitle = document.getElementById('search-input').value;
        searchVideos(searchTitle);
    });

    // 新增视频表单提交事件
    document.getElementById('add-video-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('add-title').value;
        const url = document.getElementById('add-url').value;
        const duration = document.getElementById('add-duration').value;
        addVideo({title, url, duration});
    });

    // 修改视频表单提交事件
    document.getElementById('update-video-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const videoId = document.getElementById('update-video-id').value;
        const title = document.getElementById('update-title').value;
        const url = document.getElementById('update-url').value;
        const duration = document.getElementById('update-duration').value;
        updateVideo({videoId, title, url, duration});
    });
});

function loadVideoList() {
    axios.get('/videos')
        .then(function (response) {
            const videoList = response.data;
            const tableBody = document.getElementById('video-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            videoList.forEach(function (video) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${video.videoId}</td>
                    <td>${video.title}</td>
                    <td>${video.videoUrl}</td>
                    <td>${video.duration}</td>
                    <td>
                        <button onclick="editVideo(${video.videoId})">修改</button>
                        <button onclick="deleteVideo(${video.videoId})">删除</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(function (error) {
            console.log('加载视频列表出错：', error);
        });
}

function searchVideos(title) {
    axios.get('/videos', {params: {title}})
        .then(function (response) {
            const videoList = response.data;
            const tableBody = document.getElementById('video-table').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            videoList.forEach(function (video) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${video.videoId}</td>
                    <td>${video.title}</td>
                    <td>${video.videoUrl}</td>
                    <td>${video.duration}</td>
                    <td>
                        <button onclick="editVideo(${video.videoId})">修改</button>
                        <button onclick="deleteVideo(${video.videoId})">删除</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(function (error) {
            console.log('搜索视频出错：', error);
        });
}

function addVideo(video) {
    axios.post('/videos', video)
        .then(function () {
            document.getElementById('add-video-form')[0].reset();
            loadVideoList();
            alert('视频新增成功');
        })
        .catch(function (error) {
            console.log('新增视频出错：', error);
            alert('视频新增失败');
        });
}

function editVideo(videoId) {
    axios.get(`/videos/${videoId}`)
        .then(function (response) {
            const video = response.data;
            document.getElementById('update-video-id').value = video.videoId;
            document.getElementById('update-title').value = video.title;
            document.getElementById('update-url').value = video.videoUrl;
            document.getElementById('update-duration').value = video.duration;
            document.getElementById('update-video-form').style.display = 'block';
        })
        .catch(function (error) {
            console.log('获取视频信息出错：', error);
        });
}

function updateVideo(video) {
    axios.put(`