use async_trait::async_trait;
use entry::{Entry, Sequence};

pub type WriteBufferError = Box<dyn std::error::Error + Sync + Send>;

/// A Write Buffer takes an `Entry` and returns `Sequence` data that facilitates reading entries
/// from the Write Buffer at a later time.
#[async_trait]
pub trait WriteBuffer: Sync + Send + std::fmt::Debug + 'static {
    /// Send an `Entry` to the write buffer and return information that can be used to restore
    /// entries at a later time.
    async fn store_entry(&self, entry: &Entry) -> Result<Sequence, WriteBufferError>;

    // TODO: interface for restoring, will look something like:
    // async fn restore_from(&self, sequence: &Sequence) -> Result<Stream<Entry>, Err>;
}

#[derive(Debug)]
pub struct KafkaBuffer {
    conn: String,
    database_name: String,
}

#[async_trait]
impl WriteBuffer for KafkaBuffer {
    async fn store_entry(&self, _entry: &Entry) -> Result<Sequence, WriteBufferError> {
        unimplemented!()
    }
}

impl KafkaBuffer {
    pub fn new(conn: impl Into<String>, database_name: impl Into<String>) -> Self {
        Self {
            conn: conn.into(),
            database_name: database_name.into(),
        }
    }
}

pub mod test_helpers {
    use super::*;
    use std::sync::{Arc, Mutex};

    #[derive(Debug, Default)]
    pub struct MockBuffer {
        pub entries: Arc<Mutex<Vec<Entry>>>,
    }

    #[async_trait]
    impl WriteBuffer for MockBuffer {
        async fn store_entry(&self, entry: &Entry) -> Result<Sequence, WriteBufferError> {
            let mut entries = self.entries.lock().unwrap();
            let offset = entries.len() as u64;
            entries.push(entry.clone());

            Ok(Sequence {
                id: 0,
                number: offset,
            })
        }
    }
}
