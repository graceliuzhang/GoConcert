const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parseApiError = (payload, currentMode, statusCode) => {
    const detail = payload?.detail;

    if (currentMode === 'login') {
      if ([400, 401, 422].includes(statusCode)) {
        return 'Invalid Credentials';
      }
    }

    if (Array.isArray(detail)) {
      const passwordTooShort = detail.some((item) => {
        const location = Array.isArray(item?.loc) ? item.loc.join('.') : '';
        const type = String(item?.type || '');
        const message = String(item?.msg || '').toLowerCase();

        return (
          location.includes('password')
          && (
            type.includes('too_short')
            || type.includes('min_length')
            || message.includes('at least')
            || message.includes('too short')
          )
        );
      });

      if (currentMode === 'register' && passwordTooShort) {
        return 'password is too short';
      }

      const firstMessage = detail.find((item) => typeof item?.msg === 'string')?.msg;
      if (firstMessage) {
        return firstMessage;
      }
    }

    if (typeof detail === 'string') {
      return detail;
    }

    return 'Authentication failed';
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || 'Authentication failed');
        throw new Error(parseApiError(payload, mode, response.status));
      }

      const authPayload = await response.json();
    }