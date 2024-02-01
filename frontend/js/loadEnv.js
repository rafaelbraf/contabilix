const loadEnv = async () => {
    const response = await fetch('.env');
    const envText = await response.text();
    const envLines = envText.split('\n');

    for (const line in envLines) {
        const [key, value] = line.split('=');
        if (key && value) {
            window[key.trim()] = value.trim();
        }
    }
};

loadEnv();