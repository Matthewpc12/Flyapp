import net from 'net';

const client = new net.Socket();
client.connect(6881, 'tracker.openbittorrent.com', function() {
	console.log('Connected');
	client.destroy();
});

client.on('error', function(err) {
    console.log('Error: ' + err.message);
});
