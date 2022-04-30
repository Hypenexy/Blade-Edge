<?php
echo '
<div class="info">
    <p>0 Players worldwide</p>
</div>';

if(!isset($_SESSION['id'])){
    echo '
        <div class="article welcomemsg">
        <h1>Welcome to Blade Edge</h1>
        <h2>Pinned message</h2>
        <p>A game all about fighting. Create your champions and compete with other players!</p>
        </div>
    ';
}

echo '
<div class="article">
<h1>Title</h1>
<h2>Subtitle</h2>
<p>Paragraph. So we did nothing basically added these news</p>
</div>';