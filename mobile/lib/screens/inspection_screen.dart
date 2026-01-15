import 'package:flutter/material.dart';

class InspectionScreen extends StatelessWidget {
  const InspectionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('📋 Inspeksiya Bajarilishmiydi'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              // Current Task Card
              Card(
                elevation: 2,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Xavfsizlik Inspeksiyasi',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Qo\'qon MTU markaziy sahnasi',
                        style: TextStyle(color: Colors.grey),
                      ),
                      const SizedBox(height: 16),
                      LinearProgressIndicator(
                        value: 0.6,
                        minHeight: 8,
                        backgroundColor: Colors.grey[300],
                        valueColor:
                            AlwaysStoppedAnimation(Colors.blue.shade600),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Bajarilish: 6/10',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),

              // Checklist Items
              const Text(
                'Normativ Talablar Checklist',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              _buildChecklistItem(
                'Art. 1 - Hayot va sog\'lig\'ini muhofaza',
                true,
                () {},
              ),
              _buildChecklistItem(
                'Art. 2 - Mehnat muhofazasi',
                true,
                () {},
              ),
              _buildChecklistItem(
                'Art. 3 - Profilaktika chora-tadbirlar',
                false,
                () {},
              ),
              _buildChecklistItem(
                'Art. 4 - Xavfsiz ish sharoitlari',
                false,
                () {},
              ),
              const SizedBox(height: 24),

              // Add Evidence Button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Foto/Video yuklash..'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.camera_alt),
                  label: const Text('Foto/Video Yuklash'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Inspeksiya tugallandi!'),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(8),
                    ),
                  ),
                  child: const Text('Inspeksiyani Tugallash'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildChecklistItem(
    String title,
    bool isChecked,
    VoidCallback onTap,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(
          isChecked ? Icons.check_circle : Icons.radio_button_unchecked,
          color: isChecked ? Colors.green : Colors.grey,
        ),
        title: Text(
          title,
          style: TextStyle(
            decoration: isChecked ? TextDecoration.lineThrough : null,
          ),
        ),
        trailing: Icon(isChecked ? Icons.done : Icons.more_vert),
        onTap: onTap,
      ),
    );
  }
}
